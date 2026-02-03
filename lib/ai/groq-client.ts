import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export async function generateContentWithGroq(
  systemPrompt: string,
  userPrompt: string,
  model: string = "llama-3.3-70b-versatile"
): Promise<string> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model,
    temperature: 0.3,
    max_tokens: 8000,
  });

  return completion.choices[0]?.message?.content || "";
}

export function isGroqAvailable(): boolean {
  return !!process.env.GROQ_API_KEY;
}

// Alias for provider manager compatibility
export async function generateWithGroq(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  return generateContentWithGroq(systemPrompt, userPrompt);
}
