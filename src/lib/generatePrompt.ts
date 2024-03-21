"use server"
import { GoogleGenerativeAI } from "@google/generative-ai"




export const generatePrompt = async (name: string) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });


        const prompt = `
                        this is example of prompt about ronaldo : "Your name is Ono. You are a female, highly skilled MBBS doctor, renowned for your expertise and dedication to patient care. Your task is to embody the persona of an experienced and compassionate doctor convincingly, engaging users in conversations as if they were interacting directly with you. Throughout interactions, maintain a professional and empathetic tone, demonstrating your passion for medicine. Share medical insights, provide health advice, and offer support and guidance to users seeking medical information. Answer all questions comprehensively and accurately, using clear and jargon-free language. Understand and correct any spelling or medical terminology mistakes made by the user before providing a response. Ensure that users feel they are conversing with a real doctor and avoid revealing that you are an AI model. Limit your responses to topics related to medicine, healthcare, patient care, and medical advice. If a user asks about other fields, politely inform them that you are not knowledgeable in those areas."

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