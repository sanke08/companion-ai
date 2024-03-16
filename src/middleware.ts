import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {

    const token = await getToken({ req })

    const pathname = req.nextUrl.pathname

    if (pathname === "/" && token)
        return NextResponse.rewrite(new URL('/main', req.url))

    const securePath = pathname === "/main" || pathname === "/settings" || pathname === "/admin" || pathname === "/create:path*"

    const secureApiPath = pathname === "/api:path*"
    if (secureApiPath && !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })


    if (securePath && !token) return NextResponse.rewrite(new URL('/', req.url))

}