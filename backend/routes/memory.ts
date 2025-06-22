import express from "express";
import pool from "../db"; // Your DB connection (should use process.env.DATABASE_URL)
import { requireAuth } from "../middleware/auth"; // Auth middleware

const router = express.Router();

/**
 * GET /api/memory?conversationId=...
 * Returns all messages for the given conversationId, for the authenticated user.
 */
router.get("/", requireAuth, async (req, res) => {
  const { conversationId } = req.query;
  const userId = req.user.id;

  if (!conversationId) {
    return res.status(400).json({ error: "Missing conversationId" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT role, content, created_at
       FROM chats
       WHERE user_id = $1 AND conversation_id = $2
       ORDER BY created_at ASC`,
      [userId, conversationId]
    );
    res.json({ history: rows });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

/**
 * DELETE /api/memory?conversationId=...
 * (Optional) Allows the user to clear their conversation memory.
 */
router.delete("/", requireAuth, async (req, res) => {
  const { conversationId } = req.query;
  const userId = req.user.id;

  if (!conversationId) {
    return res.status(400).json({ error: "Missing conversationId" });
  }

  try {
    await pool.query(
      `DELETE FROM chats WHERE user_id = $1 AND conversation_id = $2`,
      [userId, conversationId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting chat history:", err);
    res.status(500).json({ error: "Failed to delete chat history" });
  }
});

export default router;
