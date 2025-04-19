import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "../../lib/tools"; // Import tools

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  // Look for direct currency conversion requests in the last message
  const lastMessage = messages[messages.length - 1];
  const convertPattern =
    /convert\s+(\d+(\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i;

  const match = lastMessage?.content?.match(convertPattern);
  if (match) {
    try {
      // Direct use of currency conversion tool when pattern is detected
      const amount = parseFloat(match[1]);
      const fromCurrency = match[3].toUpperCase();
      const toCurrency = match[4].toUpperCase();

      // Call the tool directly
      const result = await tools.convertCurrency.execute({
        amount,
        fromCurrency,
        toCurrency,
      });

      // Return the result directly
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error with direct currency conversion:", error);
      // Continue with normal AI processing if direct conversion fails
    }
  }

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
