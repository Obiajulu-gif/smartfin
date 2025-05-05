import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const userMessage = body.message;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful financial assistant." },
                { role: "user", content: userMessage },
            ],
        });

        const responseMessage = completion.choices[0].message.content;

        return NextResponse.json({ message: responseMessage });
    } catch (error) {
        console.error("Error in chatbot API:", error);
        return NextResponse.json({ error: "Failed to process chatbot request" }, { status: 500 });
    }
}