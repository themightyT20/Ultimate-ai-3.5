import fetch from "node-fetch";

const REPLICATE_API_URL = "https://api.replicate.com/v1/completions";

export async function callReplicate(prompt: string, model: string): Promise<string> {
  const REPLICATE_KEY = process.env.REPLICATE_KEY;
  if (!REPLICATE_KEY) throw new Error("Missing REPLICATE_KEY in environment");

  const response = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_KEY}`,
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

  if (!response.ok) throw new Error(`Replicate API error: ${response.statusText}`);
  const data = await response.json();
  return data?.choices?.[0]?.text || JSON.stringify(data);
}
