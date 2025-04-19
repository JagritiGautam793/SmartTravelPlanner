import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "../../lib/tools"; // Import tools

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  // Look for direct currency conversion requests in the last message
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage?.content) {
    return streamText({
      model: openai("gpt-4o"),
      messages,
      tools,
      maxSteps: 5,
    }).toDataStreamResponse({
      headers: { "Content-Type": "application/octet-stream" },
    });
  }

  // Map of common currency names to their ISO codes
  const currencyMap = {
    dollar: "USD",
    dollars: "USD",
    "us dollar": "USD",
    "us dollars": "USD",
    "american dollar": "USD",
    "american dollars": "USD",
    usd: "USD",
    euro: "EUR",
    euros: "EUR",
    eur: "EUR",
    pound: "GBP",
    pounds: "GBP",
    "british pound": "GBP",
    "british pounds": "GBP",
    gbp: "GBP",
    sterling: "GBP",
    yen: "JPY",
    "japanese yen": "JPY",
    jpy: "JPY",
    yuan: "CNY",
    "chinese yuan": "CNY",
    cny: "CNY",
    rmb: "CNY",
    rupee: "INR",
    rupees: "INR",
    "indian rupee": "INR",
    "indian rupees": "INR",
    inr: "INR",
    franc: "CHF",
    francs: "CHF",
    "swiss franc": "CHF",
    "swiss francs": "CHF",
    chf: "CHF",
    "canadian dollar": "CAD",
    "canadian dollars": "CAD",
    cad: "CAD",
    "australian dollar": "AUD",
    "australian dollars": "AUD",
    aud: "AUD",
    "singapore dollar": "SGD",
    "singapore dollars": "SGD",
    sgd: "SGD",
  };

  // Collection of regex patterns to match various currency conversion requests
  const conversionPatterns = [
    // Explicit conversion formats
    /convert\s+(\d+(\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i, // "convert 100 USD to EUR"
    /exchange\s+(\d+(\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i, // "exchange 50 GBP to JPY"
    /(\d+(\.\d+)?)\s+([a-z]{3})\s+in\s+([a-z]{3})/i, // "50 USD in EUR"
    /(\d+(\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i, // "100 EUR to USD"

    // Natural language formats
    /(\d+(\.\d+)?)\s+(dollars|euros?|pounds|yen|yuan|rupees?|francs?)\s+(in|to)\s+([a-z]+)/i, // "100 dollars in euros"
    /how\s+much\s+(is|are)\s+(\d+(\.\d+)?)\s+([a-z]+)\s+(in|as)\s+([a-z]+)/i, // "how much is 50 euros in dollars"
    /what('s|\s+is)\s+(\d+(\.\d+)?)\s+([a-z]+)\s+(in|to|as)\s+([a-z]+)/i, // "what's 200 yen in dollars"
  ];

  // Helper function to get currency code
  const getCurrencyCode = (currency) => {
    return currencyMap[currency.toLowerCase()] || currency.toUpperCase();
  };

  // Try to extract currency conversion information
  for (const pattern of conversionPatterns) {
    const match = lastMessage.content.match(pattern);
    if (match) {
      try {
        let amount, fromCurrency, toCurrency;

        // Handle different match patterns
        if (match[1] && match[3] && match[4] && match[3].length <= 4) {
          // "convert 100 USD to EUR" format
          amount = parseFloat(match[1]);
          fromCurrency = getCurrencyCode(match[3]);
          toCurrency = getCurrencyCode(match[4]);
        } else if (match[1] && match[3] && match[5]) {
          // "100 dollars in euros" format
          amount = parseFloat(match[1]);
          fromCurrency = getCurrencyCode(match[3]);
          toCurrency = getCurrencyCode(match[5]);
        } else if (match[2] && match[4] && match[6]) {
          // "how much is 50 euros in dollars" format
          amount = parseFloat(match[2]);
          fromCurrency = getCurrencyCode(match[4]);
          toCurrency = getCurrencyCode(match[6]);
        }

        // If we have extracted all required information
        if (amount && !isNaN(amount) && fromCurrency && toCurrency) {
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
        }
      } catch (error) {
        console.error("Error with currency conversion:", error);
        // Continue with normal AI processing if direct conversion fails
      }
    }
  }

  // Handle exchange rate queries (without specific amount)
  const exchangeRatePatterns = [
    /exchange\s+rate\s+(between|from|of)\s+([a-z]+)\s+(to|and)\s+([a-z]+)/i, // "exchange rate between euro and dollar"
    /what('s|\s+is)\s+the\s+exchange\s+rate\s+(between|from|of)\s+([a-z]+)\s+(to|and)\s+([a-z]+)/i, // "what's the exchange rate from JPY to USD"
  ];

  for (const pattern of exchangeRatePatterns) {
    const match = lastMessage.content.match(pattern);
    if (match && match[2] && match[4]) {
      try {
        const fromCurrency = getCurrencyCode(match[2]);
        const toCurrency = getCurrencyCode(match[4]);

        // Use amount=1 to get the exchange rate
        const result = await tools.convertCurrency.execute({
          amount: 1,
          fromCurrency,
          toCurrency,
        });

        // Return the result directly
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error with exchange rate conversion:", error);
        // Continue with normal AI processing if direct conversion fails
      }
    }
  }

  // Use the AI SDK with the currency converter tool for all other cases
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
