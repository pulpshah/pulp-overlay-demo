import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing prompt" },
        { status: 400 }
      );
    }

    // Use the correct OpenAI chat endpoint
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo", // Ensure you're using a chat-compatible model
        messages: [
          { role: "system", content: "You are a helpful assistant. Respond strictly in JSON format." },
          { role: "user", content: prompt },
        ],
        response_format: { "type": "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error.message },
        { status: response.status }
      );
    }

    const data = await response.json();
    

    // Extract and return claims
    const messageContent = data.choices?.[0]?.message?.content || "";
    console.log("OpenAI Response:", messageContent);
    return NextResponse.json({ claims: JSON.parse(messageContent) });
  } catch (error) {
    console.error("Error in API Proxy:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
