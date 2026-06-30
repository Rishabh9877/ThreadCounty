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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are the ThreadCounty AI Assistant. You help users understand fabric analysis, upload best practices, pricing, and account issues. Be concise, helpful, and polite. Always format your responses clearly."
    });

    // Format chat history for Gemini. 
    // Gemini requires history to start with a 'user' message and alternate.
    // We filter out the hardcoded initial 'welcome' assistant message if it's the first one.
    const historyMessages = messages.slice(0, -1).filter((msg: any, index: number) => {
      // If the very first message in the array is an assistant message (like the welcome), skip it
      if (index === 0 && msg.role !== "user") return false;
      return true;
    });

    const history = historyMessages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chatSession = model.startChat({
      history,
    });

    const result = await chatSession.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response: " + error.message },
      { status: 500 }
    );
  }
}
