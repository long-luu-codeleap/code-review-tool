import { generateWithClaude } from "./claude-client";
import { generateWithGroq } from "./groq-client";
import { generateContent as generateWithGemini } from "./gemini-client";
import type { AIProvider, ProviderConfig, GenerateOptions } from "./types";

// Provider configurations in priority order
const providers: ProviderConfig[] = [
  {
    name: "claude",
    available: !!process.env.ANTHROPIC_API_KEY,
    generateFn: generateWithClaude,
  },
  {
    name: "groq",
    available: !!process.env.GROQ_API_KEY,
    generateFn: generateWithGroq,
  },
  {
    name: "gemini",
    available: !!process.env.GOOGLE_API_KEY,
    generateFn: generateWithGemini,
  },
];

export async function generateWithFallback(
  systemPrompt: string,
  userPrompt: string,
  options: GenerateOptions = {}
): Promise<{ content: string; provider: AIProvider }> {
  const { allowedProviders, preferredProvider } = options;

  // Filter to allowed providers
  let availableProviders = providers.filter((p) => p.available);
  if (allowedProviders) {
    availableProviders = availableProviders.filter((p) =>
      allowedProviders.includes(p.name)
    );
  }

  // Sort by preference
  if (preferredProvider) {
    availableProviders.sort((a, b) => {
      if (a.name === preferredProvider) return -1;
      if (b.name === preferredProvider) return 1;
      return 0;
    });
  }

  if (availableProviders.length === 0) {
    throw new Error(
      "No AI providers configured. Please set ANTHROPIC_API_KEY, GROQ_API_KEY, or GOOGLE_API_KEY"
    );
  }

  // Try each provider in order
  const errors: Array<{ provider: AIProvider; error: Error }> = [];

  for (const provider of availableProviders) {
    try {
      console.log(`Attempting generation with ${provider.name}...`);
      const content = await provider.generateFn(systemPrompt, userPrompt);
      console.log(`✓ Success with ${provider.name}`);
      return { content, provider: provider.name };
    } catch (error) {
      console.warn(`✗ ${provider.name} failed:`, error);
      errors.push({
        provider: provider.name,
        error: error instanceof Error ? error : new Error(String(error)),
      });
      // Continue to next provider
    }
  }

  // All providers failed
  const errorMsg = errors
    .map((e) => `${e.provider}: ${e.error.message}`)
    .join("; ");
  throw new Error(`All AI providers failed: ${errorMsg}`);
}

export function getAvailableProviders(): AIProvider[] {
  return providers.filter((p) => p.available).map((p) => p.name);
}
