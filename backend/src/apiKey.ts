import { v4 as uuidv4 } from "uuid";

// For demo: Store keys in-memory (restart = all keys lost). For real projects, use a database!
const validApiKeys = new Set<string>();

export function generateApiKey(): string {
  const apiKey = uuidv4();
  validApiKeys.add(apiKey);
  return apiKey;
}

export function validateApiKey(apiKey: string | undefined): boolean {
  if (!apiKey) return false;
  return validApiKeys.has(apiKey);
}
