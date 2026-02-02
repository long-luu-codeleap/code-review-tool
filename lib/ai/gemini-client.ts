import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, GROQ_MODEL } from "@/lib/constants";
import { generateContentWithGroq, isGroqAvailable } from "./groq-client";

let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is not set");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

async function generateWithGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;
  return response.text();
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  // Try Groq first if available (free tier with high rate limits)
  if (isGroqAvailable()) {
    try {
      console.log("Using Groq API for generation...");
      return await generateContentWithGroq(systemPrompt, userPrompt, GROQ_MODEL);
    } catch (error: any) {
      console.warn("Groq API failed, falling back to Gemini:", error.message);
      // Fall through to Gemini
    }
  }

  // Fall back to Gemini with retry logic
  console.log("Using Gemini API for generation...");
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await generateWithGemini(systemPrompt, userPrompt);
    } catch (error: any) {
      lastError = error;

      // Check if it's a retryable error (503, 429, or network errors)
      const isRetryable =
        error?.message?.includes("503") ||
        error?.message?.includes("Service Unavailable") ||
        error?.message?.includes("overloaded") ||
        error?.message?.includes("429") ||
        error?.message?.includes("quota") ||
        error?.message?.includes("ECONNRESET") ||
        error?.message?.includes("ETIMEDOUT");

      if (!isRetryable || attempt === maxRetries - 1) {
        // Not retryable or last attempt - throw error
        throw error;
      }

      // Exponential backoff: 2s, 4s, 8s
      const backoffMs = Math.pow(2, attempt + 1) * 1000;
      console.log(
        `Gemini API error (attempt ${attempt + 1}/${maxRetries}): ${error.message}. Retrying in ${backoffMs / 1000}s...`
      );
      await sleep(backoffMs);
    }
  }

  throw lastError || new Error("Failed to generate content after retries");
}

