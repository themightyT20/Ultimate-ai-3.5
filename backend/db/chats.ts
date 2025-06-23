import { Pool } from "pg";
const pool = new Pool();

export async function saveChatMessage(userId: number, conversationId: string, message: string, role: string) {
  await pool.query(
    "INSERT INTO chats (user_id, conversation_id, message, role) VALUES ($1, $2, $3, $4)",
    [userId, conversationId, message, role]
  );
}

export async function getChatHistory(userId: number, conversationId: string) {
  const res = await pool.query(
    "SELECT * FROM chats WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC",
    [userId, conversationId]
  );
  return res.rows;
}
