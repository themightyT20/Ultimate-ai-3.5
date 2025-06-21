import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES module dirname/filename workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { Pool } from "pg";

// Always require DATABASE_URL to be set
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}
export const pool = new Pool({ connectionString });

// --- Users ---

export async function createUser(username: string, passwordHash: string) {
  const result = await pool.query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
    [username, passwordHash]
  );
  return result.rows[0];
}

export async function getUserByUsername(username: string) {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0];
}

// --- API Keys ---

export async function setUserApiKey(userId: string, apiKey: string) {
  await pool.query(
    `INSERT INTO api_keys (user_id, api_key)
     VALUES ($1, $2)
     ON CONFLICT (user_id)
     DO UPDATE SET api_key = EXCLUDED.api_key`,
    [userId, apiKey]
  );
}

export async function getUserByApiKey(apiKey: string) {
  const res = await pool.query(
    "SELECT user_id FROM api_keys WHERE api_key = $1",
    [apiKey]
  );
  return res.rows[0];
}

// --- Chat Messages ---

export async function addChatMessage(
  userId: string,
  conversationId: string,
  message: string,
  role: string = "user"
) {
  await pool.query(
    `INSERT INTO chat_messages (user_id, conversation_id, message, role, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [userId, conversationId, message, role]
  );
}

export async function getChatHistory(
  userId: string,
  conversationId: string,
  limit: number = 20
) {
  const res = await pool.query(
    `SELECT message, role, created_at
     FROM chat_messages
     WHERE user_id = $1 AND conversation_id = $2
     ORDER BY created_at ASC
     LIMIT $3`,
    [userId, conversationId, limit]
  );
  return res.rows;
}
