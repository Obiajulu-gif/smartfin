import { NextResponse } from "next/server";
import OpenAI from "openai";

// Check if API key exists before initializing OpenAI
const apiKey = process.env.OPENAI_API_KEY;
let openai;

if (apiKey) {
    openai = new OpenAI({
        apiKey: apiKey,
    });
}

export async function POST(req) {
    try {
        // Check if OpenAI is properly initialized
        if (!openai) {
            console.error("OpenAI API key is missing");
            return NextResponse.json(
                { error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." },
                { status: 500 }
            );
        }

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
        return NextResponse.json(
            { error: "Failed to process chatbot request" },
            { status: 500 }
        );
    }
}