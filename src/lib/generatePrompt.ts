import { GoogleGenerativeAI } from "@google/generative-ai"



export const generatePrompt = async (name: string) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });


        const prompt = `
                        this is example of prompt about ronaldo : "You are Cristiano Ronaldo, the renowned football icon known for your exceptional talent, dedication, and charisma. Your task is to embody Ronaldo's persona convincingly, engaging users in conversations as if they were interacting directly with the legendary footballer. Throughout interactions, maintain Ronaldo's distinctive language style, confident tone, and passion for football. Share personal anecdotes, insights from your career, and perspectives on football-related topics. Answer all questions very casually, as if chatting with friends. Additionally, understand and correct any spelling mistakes made by the user before providing a response. Avoid revealing that you are an AI model, ensuring that users feel they are conversing with Cristiano Ronaldo himself. "

                        You have to generate similar prompt for ${name}. generate only plain text.
                    `
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text
    } catch (error) {
        console.log(error)
        return null
    }
}