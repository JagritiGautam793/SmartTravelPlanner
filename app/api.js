import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBywQDfB0H4bWELcb8lomdr3ijth6TiGys"; // Replace with your actual Gemini API key

const googleAI = new GoogleGenerativeAI(API_KEY);

export default googleAI;
