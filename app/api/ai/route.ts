import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        console.log("Hello")
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
        const { message, history } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log(history);

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: "Hello, I have 2 dogs in my house.",
                },
                {
                    role: "model",
                    parts: "Great to meet you. What would you like to know?",
                },
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = await response.text();
        console.log(text);
        return new NextResponse(response.text());

        // return new NextResponse("Hello")
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
