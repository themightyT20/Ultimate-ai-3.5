#!/usr/bin/env node

const axios = require("axios");
const readline = require("readline");

const chatEndpoint = process.env.ULTIMATE_AI_ENDPOINT || "https://optimum-extremely-fox.ngrok-free.app/api/chat";
const apiKey = process.env.ULTIMATE_AI_API_KEY;
const conversationId = process.env.ULTIMATE_AI_SESSION || "npx-session";

const baseApi = chatEndpoint.replace(/\/api\/chat$/, "/api");

if (!apiKey) {
  console.error("Error: Please set your API key in the ULTIMATE_AI_API_KEY environment variable.");
  process.exit(1);
}

async function printUserInfo() {
  try {
    const res = await axios.get(`${baseApi}/me`, {
      headers: { "x-api-key": apiKey }
    });
    const user = res.data;
    if (user && user.username) {
      console.log(`Logged in as: ${user.username}\n`);
    } else {
      console.log(`Logged in, but could not fetch username.\n`);
    }
  } catch (err) {
    console.log("> Error fetching user info: " + (err.response?.data?.error || err.message) + "\n");
  }
}

console.log("welcome this is the official cli for ultimate ai 3.5 feel free to ask any questions here\n");

printUserInfo().then(() => {
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

      // Handle the nested response structure: data.response.response
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
});
