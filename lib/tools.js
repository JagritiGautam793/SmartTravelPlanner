import { tool } from "ai";
import { z } from "zod";

// Currency conversion tool definition
export const convertCurrency = tool({
  name: "convertCurrency",
  description:
    "Convert an amount from one currency to another using real-time exchange rates. This tool MUST be used for ANY query related to currency conversion, exchange rates, or questions about how much one currency is worth in another currency.",
  parameters: z.object({
    amount: z.number().describe("The amount to convert"),
    fromCurrency: z
      .string()
      .describe("The source currency code (e.g., USD, EUR, GBP)"),
    toCurrency: z
      .string()
      .describe("The target currency code (e.g., USD, EUR, GBP)"),
  }),
  examples: [
    // Explicit conversion
    {
      input: { amount: 100, fromCurrency: "USD", toCurrency: "EUR" },
      query: "Convert 100 USD to EUR",
    },
    // More natural language
    {
      input: { amount: 50, fromCurrency: "USD", toCurrency: "EUR" },
      query: "How much is 50 dollars in euros?",
    },
    // Using currency names
    {
      input: { amount: 75, fromCurrency: "GBP", toCurrency: "JPY" },
      query: "I have 75 pounds, what's that in yen?",
    },
    // Exchange rate question
    {
      input: { amount: 1, fromCurrency: "GBP", toCurrency: "JPY" },
      query: "What's the exchange rate between GBP and JPY?",
    },
    // Indirect question
    {
      input: { amount: 200, fromCurrency: "CAD", toCurrency: "USD" },
      query:
        "If I have 200 Canadian dollars, how many US dollars would that be?",
    },
    // Question with context
    {
      input: { amount: 1000, fromCurrency: "EUR", toCurrency: "INR" },
      query:
        "I'm traveling to India next month and have 1000 euros. How many rupees will I get?",
    },
    // Casual question
    {
      input: { amount: 30, fromCurrency: "USD", toCurrency: "MXN" },
      query: "30 bucks in Mexican pesos please",
    },
    // Common question formats
    {
      input: { amount: 50, fromCurrency: "CNY", toCurrency: "USD" },
      query: "what is 50 yuan to usd",
    },
    {
      input: { amount: 100, fromCurrency: "JPY", toCurrency: "USD" },
      query: "100 yen in dollars",
    },
  ],
  execute: async ({ amount, fromCurrency, toCurrency }) => {
    try {
      // Standardize currency codes to uppercase
      const from = fromCurrency.toUpperCase();
      const to = toCurrency.toUpperCase();

      // Map common currency names to codes if needed
      const currencyMap = {
        dollar: "USD",
        dollars: "USD",
        usd: "USD",
        euro: "EUR",
        euros: "EUR",
        eur: "EUR",
        pound: "GBP",
        pounds: "GBP",
        gbp: "GBP",
        sterling: "GBP",
        yen: "JPY",
        jpy: "JPY",
        yuan: "CNY",
        cny: "CNY",
        rmb: "CNY",
        rupee: "INR",
        rupees: "INR",
        inr: "INR",
        franc: "CHF",
        francs: "CHF",
        chf: "CHF",
      };

      // Convert currency names to codes if needed
      const fromCode = currencyMap[from.toLowerCase()] || from;
      const toCode = currencyMap[to.toLowerCase()] || to;

      // Fetch real-time exchange rates
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCode}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch exchange rates: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Check if the target currency exists in the rates
      if (!data.rates[toCode]) {
        throw new Error(`Currency code ${toCode} not found`);
      }

      // Calculate the converted amount
      const exchangeRate = data.rates[toCode];
      const convertedAmount = amount * exchangeRate;

      return {
        type: "currency_conversion",
        amount,
        fromCurrency: fromCode,
        toCurrency: toCode,
        exchangeRate,
        convertedAmount: parseFloat(convertedAmount.toFixed(2)),
        date: data.date,
      };
    } catch (error) {
      console.error("Error converting currency:", error);

      return {
        error:
          error instanceof Error ? error.message : "Failed to convert currency",
        amount,
        fromCurrency,
        toCurrency,
      };
    }
  },
});

// Export only the currency conversion tool
export const tools = {
  convertCurrency,
};
