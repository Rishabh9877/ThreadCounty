import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// API key will be read inside the request handler

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format chat history for Gemini
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chatSession = model.startChat({
      history,
      systemInstruction: "You are the ThreadCounty AI Assistant. You help users understand fabric analysis, upload best practices, pricing, and account issues. Be concise, helpful, and polite. Always format your responses clearly."
    });

    const result = await chatSession.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
