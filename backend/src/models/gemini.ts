import fetch from "node-fetch";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

export async function callGemini(prompt: string, model: "gemini-2.0-flash" | "gemini-2.0"): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in environment");

  const url = `${GEMINI_API_URL}${model}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
  const data = await response.json();
  // Gemini's response shape may change; adjust as needed
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
}
