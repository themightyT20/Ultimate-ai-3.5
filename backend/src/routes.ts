import { Express, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { orchestrate } from "./orchestrator";
import {
  setUserApiKey,
  getUserByApiKey,
  addChatMessage,
  getChatHistory,
} from "./db";

// Import your memory router
import memoryRouter from "../routes/memory";

/**
 * Example setup for Express routes using persistent API keys and chat history.
 * Assumes you have authentication and can extract userId from session or JWT.
 */

export function setupRoutes(app: Express) {
  // Health check
  app.get("/", (_: Request, res: Response) =>
    res.send("Ultimate AI 3.5 backend is running.")
  );

  // Generate and store an API key for a user (requires authentication)
  app.post("/api/generate-key", async (req: Request, res: Response) => {
    // You need to replace this with your actual user auth system
    const userId = req.body.userId; // Replace with user session/JWT logic
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const apiKey = uuidv4();
    await setUserApiKey(userId, apiKey);
    res.json({ apiKey });
  });

  // Chat endpoint with persistent memory and API key validation
  app.post("/api/chat", async (req: Request, res: Response) => {
    const apiKey =
      req.headers["x-api-key"]?.toString() ||
      req.query.apiKey?.toString();
    if (!apiKey) return res.status(401).json({ error: "Invalid or missing API key." });

    const user = await getUserByApiKey(apiKey);
    if (!user) return res.status(401).json({ error: "Invalid API key." });

    const { prompt, conversationId } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid prompt." });
    }
    if (!conversationId || typeof conversationId !== "string") {
      return res.status(400).json({ error: "Missing or invalid conversationId." });
    }

    // Save user message
    await addChatMessage(user.id, conversationId, prompt, "user");

    // Retrieve history for this conversation
    const chatHistory = await getChatHistory(user.id, conversationId);

    // Call orchestrator with history (if supported)
    const result = await orchestrate(prompt, chatHistory);

    // Save assistant response
    await addChatMessage(user.id, conversationId, result.response, "assistant");

    res.json(result);
  });

  // Mount your memory API under /api/memory
  app.use("/api/memory", memoryRouter);
}
