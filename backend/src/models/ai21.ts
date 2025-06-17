import fetch from "node-fetch";

const AI21_API_URL = "https://api.ai21.com/studio/v2/jamba-instruct/complete";

export async function callAI21(prompt: string, model: string): Promise<string> {
  const AI21_KEY = process.env.AI21_KEY;
  if (!AI21_KEY) throw new Error("Missing AI21_KEY in environment");

  const response = await fetch(AI21_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI21_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      numResults: 1,
      maxTokens: 512,
      temperature: 0.7,
      topP: 0.9,
      stopSequences: []
    }),
  });

  if (!response.ok) throw new Error(`AI21 API error: ${response.statusText}`);
  const data = await response.json();
  return data?.completions?.[0]?.data?.text || JSON.stringify(data);
}
