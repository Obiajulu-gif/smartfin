import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { message } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert in personal finance." },
        { role: "user", content: `Please provide an answer related to finance: ${message}` },
      ],
      max_tokens: 80,
      temperature: 0.7,
    });
    
    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
