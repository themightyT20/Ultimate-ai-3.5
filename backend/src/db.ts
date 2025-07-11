import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable must be set");
}

const pool = new Pool({ connectionString });

// Store a new API key for a user (SINGLE key per user - legacy)
export async function setUserApiKey(userId: number, apiKey: string) {
  await pool.query("UPDATE users SET api_key = $1 WHERE id = $2", [apiKey, userId]);
}

// Retrieve a user by API key (for auth, legacy single-key logic)
export async function getUserByApiKey(apiKey: string) {
  const res = await pool.query("SELECT * FROM users WHERE api_key = $1", [apiKey]);
  return res.rows[0];
}

// Retrieve a user by username (for auth)
export async function getUserByUsername(username: string) {
  const res = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return res.rows[0];
}

// Create a new user with username and password hash
export async function createUser(username: string, passwordHash: string) {
  const res = await pool.query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
    [username, passwordHash]
  );
  return res.rows[0];
}

// Add chat message to conversation
export async function addChatMessage(
  userId: number,
  conversationId: string,
  message: string,
  role: string
) {
  await pool.query(
    "INSERT INTO chats (user_id, conversation_id, message, role) VALUES ($1, $2, $3, $4)",
    [userId, conversationId, message, role]
  );
}

// Retrieve chat history for a conversation
export async function getChatHistory(
  userId: number,
  conversationId: string,
  limit = 20
) {
  const res = await pool.query(
    "SELECT message, role, created_at FROM chats WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC LIMIT $3",
    [userId, conversationId, limit]
  );
  return res.rows;
}

// Get all unique conversations for a user, ordered by most recent message
export async function getAllConversationsForUser(userId: number) {
  const res = await pool.query(
    `
    SELECT conversation_id, MAX(created_at) as last_message
    FROM chats
    WHERE user_id = $1
    GROUP BY conversation_id
    ORDER BY last_message DESC
    `,
    [userId]
  );
  return res.rows;
}

// Export pool as named export for use in other modules
export { pool };
