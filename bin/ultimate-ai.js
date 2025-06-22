#!/usr/bin/env node

const axios = require("axios");
const readline = require("readline");

// Endpoints
const chatEndpoint = process.env.ULTIMATE_AI_ENDPOINT || "https://optimum-extremely-fox.ngrok-free.app/api/chat";
const memoryEndpoint = process.env.ULTIMATE_AI_MEMORY_ENDPOINT || "https://optimum-extremely-fox.ngrok-free.app/api/memory";
const apiKey = process.env.ULTIMATE_AI_API_KEY;
const conversationId = process.env.ULTIMATE_AI_SESSION || "npx-session";

if (!apiKey) {
  console.error("Error: Please set your API key in the ULTIMATE_AI_API_KEY environment variable.");
  process.exit(1);
}

console.log("welcome this is the official cli for ultimate ai 3.5 feel free to ask any questions here\n");
console.log("Type /memory to display chat history for this session.\n");

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

  if (prompt === "/memory") {
    // Fetch chat memory from the memory endpoint
    try {
      const res = await axios.get(memoryEndpoint, {
        params: {
          conversationId
        },
        headers: {
          "x-api-key": apiKey
        }
      });
      const history = res.data.history || res.data.messages || [];
      if (history.length === 0) {
        console.log("> No chat history found for this session.\n");
      } else {
        console.log("> Chat history:");
        history.forEach((msg) => {
          const role = msg.role || "unknown";
          const content = msg.content || "";
          console.log(`[${role}]: ${content}`);
        });
        console.log();
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      console.error(`> Error fetching memory: ${msg}\n`);
    }
    rl.prompt();
    return;
  }

  // Default: send prompt to chat endpoint
  try {
    const res = await axios.post(chatEndpoint, {
      prompt,
      conversationId
    }, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      }
    });

    const data = res.data;

    // Handle various response structures
    let responseText = "";

    if (typeof data === "string") {
      responseText = data;
    } else if (data && data.response && typeof data.response === "object" && data.response.response) {
      responseText = data.response.response;
    } else if (data && typeof data === "object") {
      // Fallback for other possible structures
      responseText = data.response || data.reply || data.message || data.text || data.content;
    }

    if (responseText) {
      console.log(`> ${responseText.trim()}\n`);
    } else {
      console.log(`> Received unexpected response format\n`);
    }

  } catch (err) {
    const msg = err.response?.data?.error || err.message;
    console.error(`> Error: ${msg}\n`);
  }
  rl.prompt();
});
