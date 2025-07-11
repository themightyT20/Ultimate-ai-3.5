import { Express, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { orchestrate } from "../src/orchestrator";
import { setUserApiKey, getUserByApiKey, addChatMessage, getChatHistory } from "../db";
import authRouter from "./auth";
import userRouter from "./user";
import memoryRouter from "../routes/memory"; // <-- ADD THIS LINE
import { requireAuth } from "../middleware/auth";

/**
 * Sets up all routes for the Ultimate AI 3.5 backend.
 */
export function setupRoutes(app: Express) {
  // Health check
  app.get("/", (_: Request, res: Response) =>
    res.send("Ultimate AI 3.5 backend is running.")
  );

  // Mount authentication routes at /api/auth
  app.use("/api/auth", authRouter);

  // Mount user info and conversation routes at /api/user
  app.use("/api/user", userRouter);

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

    // Generate a response using the orchestrator (AI)
    const aiResponse = await orchestrate(prompt, chatHistory);

    // Save AI response
    await addChatMessage(user.id, conversationId, aiResponse, "ai");

    res.json({ response: aiResponse });
  });

  // Mount your memory API under /api/memory
  app.use("/api/memory", memoryRouter); // <-- ADD THIS LINE
}
