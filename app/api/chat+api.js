import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  return result.toDataStreamResponse({
    headers: { "Content-Type": "application/octet-stream" },
  });
}
