import fetch from "node-fetch";

const HF_API_URL = "https://api-inference.huggingface.co/models/";

export async function callHuggingFace(prompt: string, model: string): Promise<string> {
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) throw new Error("Missing HF_TOKEN in environment");

  const response = await fetch(`${HF_API_URL}${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) throw new Error(`HuggingFace API error: ${response.statusText}`);
  const data = await response.json();
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
  if (data?.generated_text) return data.generated_text;
  return JSON.stringify(data);
}
