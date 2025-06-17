import { Pool } from "pg";
const pool = new Pool();

// Store a new API key for a user
export async function setUserApiKey(userId: number, apiKey: string) {
  await pool.query("UPDATE users SET api_key = $1 WHERE id = $2", [apiKey, userId]);
}

// Retrieve a user by API key (for auth)
export async function getUserByApiKey(apiKey: string) {
  const res = await pool.query("SELECT * FROM users WHERE api_key = $1", [apiKey]);
  return res.rows[0];
}

// Add chat message to conversation
export async function addChatMessage(userId: number, conversationId: string, message: string, role: string) {
  await pool.query(
    "INSERT INTO chats (user_id, conversation_id, message, role) VALUES ($1, $2, $3, $4)",
    [userId, conversationId, message, role]
  );
}

// Retrieve chat history for a conversation
export async function getChatHistory(userId: number, conversationId: string, limit = 20) {
  const res = await pool.query(
    "SELECT message, role, created_at FROM chats WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC LIMIT $3",
    [userId, conversationId, limit]
  );
  return res.rows;
}
