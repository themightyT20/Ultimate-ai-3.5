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

export function detectIntent(prompt: string): LLMIntent {
  if (/summarize|tl;dr/i.test(prompt)) return "summarize";
  if (/code|function|program|python|js|algorithm/i.test(prompt)) return "code";
  if (/why|how|explain|clarify|reason/i.test(prompt)) return "reasoning";
  if (/hi|hello|hey|wassup|what's up/i.test(prompt)) return "chat";
  return "other";
}

export async function orchestrate(prompt: string): Promise<OrchestratorResult> {
  const intent = detectIntent(prompt);

  switch (intent) {
    case "code":
      try {
        return {
          provider: "huggingface",
          model: "tiiuae/falcon-7b-instruct",
          response: await callHuggingFace(prompt, "tiiuae/falcon-7b-instruct"),
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
        model: "codellama/codellama-13b-instruct",
        response: await callReplicate(prompt, "codellama/codellama-13b-instruct"),
      };

    case "chat":
      try {
        return {
          provider: "gemini",
          model: "gemini-2.0-flash",
          response: await callGemini(prompt, "gemini-2.0-flash"),
        };
      } catch {}
      try {
        return {
          provider: "huggingface",
          model: "meta-llama/Meta-Llama-3-8B",
          response: await callHuggingFace(prompt, "meta-llama/Meta-Llama-3-8B"),
        };
      } catch {}
      return {
        provider: "together",
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        response: await callTogether(prompt, "meta-llama/Meta-Llama-3-8B-Instruct"),
      };

    case "reasoning":
      try {
        return {
          provider: "ai21",
          model: "jamba-instruct",
          response: await callAI21(prompt, "jamba-instruct"),
        };
      } catch {}
      try {
        return {
          provider: "together",
          model: "Qwen/Qwen1.5-72B-Chat",
          response: await callTogether(prompt, "Qwen/Qwen1.5-72B-Chat"),
        };
      } catch {}
      return {
        provider: "gemini",
        model: "gemini-2.0-flash",
        response: await callGemini(prompt, "gemini-2.0-flash"),
      };

    case "summarize":
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
      return {
        provider: "gemini",
        model: "gemini-2.0-flash",
        response: await callGemini(prompt, "gemini-2.0-flash"),
      };
  }
}
