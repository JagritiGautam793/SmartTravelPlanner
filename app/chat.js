import googleAI from "./api";

export async function generateResponse(prompt) {
  try {
    const model = googleAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating response!";
  }
}
