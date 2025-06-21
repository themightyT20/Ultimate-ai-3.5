#!/usr/bin/env node

const axios = require("axios");
const readline = require("readline");

const endpoint = process.env.ULTIMATE_AI_ENDPOINT || "https://optimum-extremely-fox.ngrok-free.app/api/chat";
const apiKey = process.env.ULTIMATE_AI_API_KEY;
const conversationId = process.env.ULTIMATE_AI_SESSION || "npx-session";

if (!apiKey) {
  console.error("Error: Please set your API key in the ULTIMATE_AI_API_KEY environment variable.");
  process.exit(1);
}

console.log("welcome this is the official cli for ultimate ai 3.5 feel free to ask any questions here\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">"
});

rl.prompt();

rl.on("line", async (line) => {
  const prompt = line.trim();
  if (!prompt) {
    rl.prompt();
    return;
  }

  try {
    const res = await axios.post(endpoint, {
      prompt,
      conversationId
    }, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      }
    });
    
    const data = res.data;
    
    // Debug: Show the raw response structure
    console.log("DEBUG - Raw response:", JSON.stringify(data, null, 2));
    console.log("DEBUG - Response keys:", Object.keys(data));
    
    // Handle response more robustly
    let responseText = "";
    
    if (typeof data === "string") {
      responseText = data;
    } else if (data && typeof data === "object") {
      // Try common response property names
      responseText = data.response || 
                   data.reply || 
                   data.message || 
                   data.text || 
                   data.content || 
                   data.answer ||
                   data.output ||
                   JSON.stringify(data, null, 2);
    } else {
      responseText = String(data);
    }
    
    console.log(`> ${responseText}\n`);
    
  } catch (err) {
    console.log("DEBUG - Error response:", err.response?.data);
    const msg = err.response?.data?.error || err.message;
    console.error(`> Error: ${msg}\n`);
  }
  rl.prompt();
});
