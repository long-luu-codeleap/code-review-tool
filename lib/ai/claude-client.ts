import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, CLAUDE_MAX_TOKENS } from "@/lib/constants";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

export async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: CLAUDE_MAX_TOKENS,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return textContent.text;
}
