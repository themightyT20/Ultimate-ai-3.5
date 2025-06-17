import fetch from "node-fetch";

const TOGETHER_API_URL = "https://api.together.xyz/v1/completions";

export async function callTogether(prompt: string, model: string): Promise<string> {
  const TOGETHER_KEY = process.env.TOGETHER_KEY;
  if (!TOGETHER_KEY) throw new Error("Missing TOGETHER_KEY in environment");

  const response = await fetch(TOGETHER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOGETHER_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
      stop: []
    }),
  });

  if (!response.ok) throw new Error(`Together API error: ${response.statusText}`);
  const data = await response.json();
  return data?.choices?.[0]?.text || JSON.stringify(data);
}
