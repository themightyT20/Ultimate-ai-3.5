import { Router, Request, Response } from "express";
import {
  getUserByApiKey,
  getAllConversationsForUser,
  getChatHistory
} from "../src/db";
import {
  createApiKey,
  revokeApiKey
} from "../src/apiKey"; // <-- new multi-key helpers
import crypto from "crypto";

const router = Router();

/**
 * GET /api/me
 * Returns info about the current user for the given API key.
 */
router.get("/me", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"]?.toString();
  if (!apiKey) return res.status(401).json({ error: "No API key" });

  const user = await getUserByApiKey(apiKey);
  if (!user) return res.status(401).json({ error: "Invalid API key" });

  res.json({ id: user.id, username: user.username });
});

/**
 * GET /api/conversations
 * Returns a list of all conversation IDs for the current user.
 */
router.get("/conversations", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"]?.toString();
  if (!apiKey) return res.status(401).json({ error: "No API key" });

  const user = await getUserByApiKey(apiKey);
  if (!user) return res.status(401).json({ error: "Invalid API key" });

  const conversations = await getAllConversationsForUser(user.id);
  res.json(conversations);
});

/**
 * GET /api/conversations/:id/history
 * Returns full message history for a given conversation.
 */
router.get("/conversations/:id/history", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"]?.toString();
  if (!apiKey) return res.status(401).json({ error: "No API key" });

  const user = await getUserByApiKey(apiKey);
  if (!user) return res.status(401).json({ error: "Invalid API key" });

  const conversationId = req.params.id;
  const history = await getChatHistory(user.id, conversationId);
  res.json(history);
});

/**
 * POST /api/generate-key
 * Generates and adds a new API key for the current user.
 * Returns: { apiKey: string }
 */
router.post("/generate-key", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"]?.toString();
  if (!apiKey) return res.status(401).json({ error: "No API key" });

  const user = await getUserByApiKey(apiKey);
  if (!user) return res.status(401).json({ error: "Invalid API key" });

  const newApiKey = crypto.randomBytes(32).toString("hex");
  await createApiKey(user.id, newApiKey);
  res.json({ apiKey: newApiKey });
});

/**
 * POST /api/delete-key
 * Revokes the current API key for the user.
 */
router.post("/delete-key", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"]?.toString();
  if (!apiKey) return res.status(401).json({ error: "No API key" });

  const user = await getUserByApiKey(apiKey);
  if (!user) return res.status(401).json({ error: "Invalid API key" });

  await revokeApiKey(apiKey); // new: deletes just this key
  res.json({ success: true, message: "API key revoked." });
});

export default router;
