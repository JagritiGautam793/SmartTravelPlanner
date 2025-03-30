import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; // Replace with your actual Gemini API key

const googleAI = new GoogleGenerativeAI(API_KEY);

export default googleAI;
