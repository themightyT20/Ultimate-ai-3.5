import { Pool } from "pg";
const pool = new Pool();

export async function saveChatMessage(userId: number, conversationId: string, content: string, role: string) {
  await pool.query(
    "INSERT INTO chat_messages (user_id, conversation_id, content, role) VALUES ($1, $2, $3, $4)",
    [userId, conversationId, content, role]
  );
}

export async function getChatHistory(userId: number, conversationId: string) {
  const res = await pool.query(
    "SELECT * FROM chat_messages WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC",
    [userId, conversationId]
  );
  return res.rows;
}
