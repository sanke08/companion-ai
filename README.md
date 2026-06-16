# Companion AI

A full-stack platform for creating, discovering, and chatting with custom AI companions — powered by Google Gemini, built on Next.js 14, and backed by PostgreSQL with Prisma.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 14.1.3 |
| Language | TypeScript | — |
| Database | PostgreSQL + Prisma | 6.10.1 |
| Authentication | NextAuth | v4 |
| Auth Provider | Google OAuth only | — |
| Auth Strategy | JWT (session) | — |
| AI SDK | @google/generative-ai | — |
| AI Model | gemini-2.5-flash | — |
| Cache | Upstash Redis (@upstash/redis) | — |
| State Management | Redux Toolkit | — |
| File Uploads | UploadThing | — |
| Styling | Tailwind CSS | — |
| UI Primitives | Radix UI | — |
| Package Manager | pnpm | — |

---

## Database Schema

Schema defined in `prisma/schema.prisma` targeting PostgreSQL.

### User

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `name` | String | Display name from Google |
| `email` | String | From Google account |
| `avatar` | String | Google profile picture URL |
| `role` | `ADMIN` \| `MODERATOR` \| `USER` | Default: `USER` |

### Companion

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `name` | String | Companion display name |
| `avatar` | String | UploadThing CDN URL |
| `creatorId` | FK → User | Creator reference |
| `description` | String | Short public-facing description |
| `instruction` | VarChar(2000) | System prompt / persona instruction sent to Gemini |
| `categoryName` | FK → Category | Category reference |

### Category

| Field | Type | Notes |
|---|---|---|
| `name` | String | Primary key (unique category name) |

### Verification

Acts as an access-control join table: a user can only see and chat with companions that have a matching `Verification` record.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `companionId` | FK → Companion | Cascade delete |
| `userId` | FK → User | Which user has access |

---

## Authentication

NextAuth v4 with Google OAuth as the only provider, using the JWT session strategy.

On first login, NextAuth's `signIn` callback checks for an existing user by email. If none exists, it calls `prisma.user.create` with `name`, `email`, and `avatar` from the Google profile, and assigns `role: USER`.

### Role-Based Access

| Role | Access |
|---|---|
| `USER` | Browse companions (within Verification scope), chat, create companions |
| `ADMIN` | Everything above plus `/admin/companions` and `/admin/users` |

Admin pages check `session.user.role === "ADMIN"` server-side before rendering.

---

## User Flows

### 1. Sign In → Browse → Chat

1. Visit the landing page and click "Sign in with Google" (`SignInButton` component).
2. Google OAuth completes; NextAuth creates a `User` record if this is the first login.
3. Redirect to `/home`.
4. The home page fetches companions the user has access to (via `Verification` records).
5. Use the `Categorie` filter tabs or `Searchbar` to narrow the companion grid.
6. Click a companion card to open `/chat/[companionId]`.
7. Redux `clearMessages()` is called on page load for a fresh session.
8. Type a message in `Chatinput` and press Enter to send.

### 2. Create a Companion

1. Navigate to `/companion/[id]` (new or existing).
2. `CompanionForm` guides through four sections:
   - **UploadAvaterCompanion** — upload an avatar via UploadThing; CDN URL stored in form state.
   - **NameNDescription** — companion name and short description.
   - **Selectcategory** — pick from `GET /api/category` or type a new category name.
   - **InstructionComp** — write the system prompt manually, or click "Generate" to auto-generate one from the companion name via Gemini.
3. Submit — `POST /api/companion` creates the record. If `instruction` is empty, the server calls `generatePrompt.ts` to produce one before saving.
4. Edit an existing companion via `PATCH /api/companion/[companionId]`.

### 3. Admin Panel

- `/admin/companions` — list, edit, or delete any companion (requires `role: ADMIN`).
- `/admin/users` — list users and manage roles (requires `role: ADMIN`).
- Grant ADMIN role via direct SQL: `UPDATE "User" SET role = 'ADMIN' WHERE email = '...';`

---

## AI Integration

All AI inference uses the `@google/generative-ai` SDK with model `gemini-2.5-flash`.

**Shared generation config:**

```
temperature:     0.9
topK:            1
topP:            1
maxOutputTokens: 2048
```

### chathelper.ts — Chat Responses

Called for every user message during a chat session.

1. Initializes the Gemini client with `GEMINI_API_KEY`.
2. Starts a chat session with `companion.instruction` as the system context.
3. Injects output constraints into the system context: respond in HTML only, using only `<div>`, `<p>`, `<ul>`, `<li>` tags and Tailwind classes `text-sm`, `font-semibold`, `list-disc`, `list-inside`. No `<script>` tags.
4. Sends the user's message and awaits the response.
5. Returns `{ role: "model", parts: "<html string>" }`.

The HTML string is rendered in `MessageContaier` via `dangerouslySetInnerHTML`.

### generatePrompt.ts — Auto-Instruction Generation

Called when the user clicks "Generate" in `InstructionComp` during companion creation.

1. Takes `companionName` as input.
2. Calls Gemini with a meta-prompt requesting a persona-style system prompt for that name.
3. Returns the generated string, which fills the instruction textarea.

---

## Redux State

Redux Toolkit manages chat state with two slices.

### `chatSlice`

Stores the current conversation's messages. Cleared on each new chat page load.

| Field | Type |
|---|---|
| `messages` | `Array<{ role: "user" \| "model", parts: string }>` |

| Action | Effect |
|---|---|
| `addMessage(message)` | Appends to `messages[]` |
| `clearMessages()` | Resets `messages[]` to `[]` |

### `chatLoaderSlice`

Controls the loading indicator while waiting for the Gemini response.

| Field | Type |
|---|---|
| `loading` | boolean |

| Action | Effect |
|---|---|
| `startLoading()` | Sets `loading: true` |
| `stopLoading()` | Sets `loading: false` |

While `loading` is `true`, the chat input is disabled and a typing indicator is shown.

---

## API Endpoints

### Authentication

| Method | Path | Description |
|---|---|---|
| * | `/api/auth/[...nextauth]` | Google OAuth handler |

### Companion

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/companion` | Yes | Create a companion |
| PATCH | `/api/companion/[companionId]` | Yes (creator) | Update a companion |
| GET/POST | `/api/companion/[companionId]/verification` | Yes | Manage user access to a companion |

**POST /api/companion body:**

```json
{
  "name": "Dr. Aria",
  "description": "A compassionate AI doctor",
  "instruction": "You are Dr. Aria...",
  "categoryName": "Healthcare",
  "avatar": "https://cdn.uploadthing.com/..."
}
```

If `instruction` is omitted or empty, the server generates one via `generatePrompt.ts` before saving.

### Category

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/category` | No | Fetch all category names |

### File Upload

| Method | Path | Description |
|---|---|---|
| * | `/api/uploadthing` | Companion avatar uploader |

---

## Components

| Component | Description |
|---|---|
| `Navbar` | Top bar; `SignInButton`, user avatar, link to companion creation |
| `Sidebar` | Left navigation; home, create companion, admin links for ADMIN role |
| `SignInButton` | Calls `signIn("google")` to start Google OAuth flow |
| `Categorie` | Horizontal filter tabs populated from `GET /api/category` |
| `Searchbar` | Name-based companion search on `/home` |
| `Avatar` | Shows image URL or first-letter fallback; used in Navbar, cards, and chat |
| `FileUploader` | UploadThing drag-and-drop uploader; returns CDN URL on success |
| `CompanionForm` | Multi-section create/edit form composed of four sub-components (see below) |
| `UploadAvaterCompanion` | Avatar upload step inside `CompanionForm` |
| `NameNDescription` | Name and description inputs inside `CompanionForm` |
| `Selectcategory` | Category dropdown with free-text new-category creation |
| `InstructionComp` | System prompt textarea with "Generate" button (calls `generatePrompt.ts`) |
| `Chatinput` | Message input; dispatches Redux actions and calls `getChat()` on submit |
| `MessageContaier` | Renders `messages[]` from Redux; user text as plain, model responses as HTML |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>?schema=public
NEXTAUTH_SECRET=your-random-secret-32-chars-minimum
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GEMINI_API_KEY=your-gemini-api-key
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for Prisma |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GEMINI_API_KEY` | Google AI Studio API key for Gemini |

---

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- A PostgreSQL database (local or hosted — Supabase, Neon, Railway all work)
- A Google Cloud project with OAuth 2.0 credentials
- A Google AI Studio API key

### Install and Run

```bash
pnpm install
pnpm prisma migrate dev --name init
pnpm prisma generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create OAuth 2.0 credentials (Web Application type).
3. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
4. Copy the client ID and secret to `.env.local`.

### Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com).
2. Create an API key and add it to `.env.local` as `GEMINI_API_KEY`.

### Seed Categories

No seed script is included. Add categories via Prisma Studio (`pnpm prisma studio`) or create companions with new category names through the UI — `Selectcategory` creates new categories on the fly.

### Production Build

```bash
pnpm build
pnpm start
```

---

## Architecture

```
Browser (Next.js 14)
    │
    ├──▶ NextAuth (Google OAuth only)
    │        Creates User on first login
    │
    ├──▶ Next.js API Routes (/api/*)
    │        │
    │        ├──▶ PostgreSQL (Prisma)
    │        │        Models: User, Companion, Category, Verification
    │        │
    │        └──▶ UploadThing (companion avatar uploads)
    │
    ├──▶ Google Generative AI (gemini-2.5-flash)
    │        Chat responses + prompt auto-generation
    │
    └──▶ Redux Toolkit (client state)
             ChatSlice: messages[]
             ChatLoader: loading bool
```

---

## User Flow

1. **Sign In** → Google OAuth → NextAuth creates User if new → /home
2. **Browse Companions** → /home → Categorie filter tabs + Searchbar → companions from Verification table
3. **Create Companion** → /companion/[id]:
   - Upload avatar (UploadThing)
   - Fill name, description, select category
   - Write instruction OR click "Generate" → Gemini auto-generates system prompt
   - POST /api/companion → Companion created
4. **Chat** → click companion → /chat/[companionId] → Chatinput → chathelper.ts → gemini-2.5-flash → HTML response → Redux addMessage → MessageContaier renders via dangerouslySetInnerHTML
5. **Admin** → /admin/companions and /admin/users (ADMIN role only)

---

## Data Flow

```
User sends message in chat
    │
    ▼ Chatinput dispatch(startLoading())
getChat(companionId, userMessage, chatHistory)
    │
    ▼ Prisma: Companion.findUnique({ where: {id} }) → get companion.instruction
    │
    ▼ chathelper.ts
GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel("gemini-2.5-flash")
startChat({ history: [systemContext, ...chatHistory] })
sendMessage(userMessage)
    │ response: HTML string (div, p, ul, li only, temperature:0.9)
    │
    ▼ dispatch(addMessage({ role:"model", parts: htmlString }))
    dispatch(stopLoading())
    │
    ▼ MessageContaier re-renders → dangerouslySetInnerHTML renders HTML
```
