import { callGemini } from "./models/gemini";
import { callHuggingFace } from "./models/huggingface";
import { callAI21 } from "./models/ai21";
import { callTogether } from "./models/together";
import { callReplicate } from "./models/replicate";

export type LLMProvider = "gemini" | "huggingface" | "ai21" | "together" | "replicate";
export type LLMIntent = "code" | "chat" | "reasoning" | "summarize" | "other";
interface OrchestratorResult {
  provider: LLMProvider;
  model: string;
  response: string;
}

// Intent detection: slightly more robust, but still simple
export function detectIntent(prompt: string): LLMIntent {
  if (/\bsummarize|summary|tl;dr|recap|brief|shorten|condense\b/i.test(prompt))
    return "summarize";
  if (/\bcode|function|program|python|js|javascript|typescript|algorithm|write.*code|generate.*code|fix.*bug\b/i.test(prompt))
    return "code";
  if (/\bwhy|how|explain|clarify|reason|analyze|logic|deduce|justify|argument|thought process|step by step\b/i.test(prompt))
    return "reasoning";
  if (/\bhi|hello|hey|wassup|what's up|talk|chat|conversation|friendly|greeting\b/i.test(prompt))
    return "chat";
  return "other";
}

export async function orchestrate(prompt: string): Promise<OrchestratorResult> {
  const intent = detectIntent(prompt);

  switch (intent) {
    case "code":
      // Small/medium models that are good at code, open/free, low credit use
      try {
        return {
          provider: "huggingface",
          model: "codellama/CodeLlama-7b-Instruct-hf",
          response: await callHuggingFace(prompt, "codellama/CodeLlama-7b-Instruct-hf"),
        };
      } catch {}
      try {
        return {
          provider: "together",
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          response: await callTogether(prompt, "mistralai/Mixtral-8x7B-Instruct-v0.1"),
        };
      } catch {}
      return {
        provider: "replicate",
        model: "codellama/codellama-7b-instruct",
        response: await callReplicate(prompt, "codellama/codellama-7b-instruct"),
      };

    case "chat":
      // Small/medium open chat models, avoid large ones to save credits
      try {
        return {
          provider: "huggingface",
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          response: await callHuggingFace(prompt, "meta-llama/Meta-Llama-3-8B-Instruct"),
        };
      } catch {}
      try {
        return {
          provider: "together",
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          response: await callTogether(prompt, "mistralai/Mixtral-8x7B-Instruct-v0.1"),
        };
      } catch {}
      return {
        provider: "gemini",
        model: "gemini-2.0-flash",
        response: await callGemini(prompt, "gemini-2.0-flash"),
      };

    case "reasoning":
      // Smallest available "chat" models that can handle reasoning, in order of efficiency
      try {
        return {
          provider: "huggingface",
          model: "Qwen/Qwen1.5-7B-Chat",
          response: await callHuggingFace(prompt, "Qwen/Qwen1.5-7B-Chat"),
        };
      } catch {}
      try {
        return {
          provider: "together",
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          response: await callTogether(prompt, "mistralai/Mixtral-8x7B-Instruct-v0.1"),
        };
      } catch {}
      return {
        provider: "gemini",
        model: "gemini-2.0-flash",
        response: await callGemini(prompt, "gemini-2.0-flash"),
      };

    case "summarize":
      // Use a small summarization model, fallback to Gemini Flash
      try {
        return {
          provider: "together",
          model: "togethercomputer/RedPajama-INCITE-7B-Base",
          response: await callTogether(prompt, "togethercomputer/RedPajama-INCITE-7B-Base"),
        };
      } catch {}
      return {
        provider: "gemini",
        model: "gemini-2.0-flash",
        response: await callGemini(prompt, "gemini-2.0-flash"),
      };

    default:
      // General fallback: Gemini Flash is fast, free for most users (with quota), and minimal credit use
      return {
        provider: "gemini",
        model: "gemini-2.0-flash",
        response: await callGemini(prompt, "gemini-2.0-flash"),
      };
  }
}
