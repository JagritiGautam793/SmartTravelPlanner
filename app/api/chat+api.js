import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "../../lib/tools"; // Import only convertCurrency tool

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  // Use the AI SDK with the currency converter tool
  const result = streamText({
    model: openai("gpt-4o"), // OpenAI model
    messages,
    tools, // Pass the currency converter tool
    maxSteps: 5, // Allow up to 5 tool calls
  });

  return result.toDataStreamResponse({
    headers: { "Content-Type": "application/octet-stream" },
  });
}
