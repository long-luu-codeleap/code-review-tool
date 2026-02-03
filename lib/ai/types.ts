export type AIProvider = "claude" | "groq" | "gemini";

export interface ProviderConfig {
  name: AIProvider;
  available: boolean;
  generateFn: (system: string, user: string) => Promise<string>;
}

export interface GenerateOptions {
  allowedProviders?: AIProvider[];
  preferredProvider?: AIProvider;
}
