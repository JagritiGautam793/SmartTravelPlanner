import { tool } from "ai";
import { z } from "zod";

// Currency conversion tool definition
export const convertCurrency = tool({
  description:
    "Convert an amount from one currency to another using real-time exchange rates",
  parameters: z.object({
    amount: z.number().describe("The amount to convert"),
    fromCurrency: z
      .string()
      .describe("The source currency code (e.g., USD, EUR, GBP)"),
    toCurrency: z
      .string()
      .describe("The target currency code (e.g., USD, EUR, GBP)"),
  }),
  execute: async ({ amount, fromCurrency, toCurrency }) => {
    try {
      // Standardize currency codes to uppercase
      const from = fromCurrency.toUpperCase();
      const to = toCurrency.toUpperCase();

      // Fetch real-time exchange rates
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch exchange rates: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Check if the target currency exists in the rates
      if (!data.rates[to]) {
        throw new Error(`Currency code ${to} not found`);
      }

      // Calculate the converted amount
      const exchangeRate = data.rates[to];
      const convertedAmount = amount * exchangeRate;

      return {
        type: "currency_conversion",
        amount,
        fromCurrency: from,
        toCurrency: to,
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
