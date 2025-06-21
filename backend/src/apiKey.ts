import { pool } from "./db";

/**
 * Create a new API key for a user (multi-key system: one user, many keys).
 * You should have an "api_keys" table with columns: id (serial), user_id (int), api_key (text unique), created_at (timestamp).
 */
export async function createApiKey(userId: number, apiKey: string) {
  await pool.query(
    "INSERT INTO api_keys (user_id, api_key) VALUES ($1, $2)",
    [userId, apiKey]
  );
}

/**
 * Revoke (delete) a specific API key. This does not affect other keys for the user.
 */
export async function revokeApiKey(apiKey: string) {
  await pool.query(
    "DELETE FROM api_keys WHERE api_key = $1",
    [apiKey]
  );
}

/**
 * Get all API keys for a user (optional, for listing keys).
 */
export async function getApiKeysForUser(userId: number) {
  const res = await pool.query(
    "SELECT api_key, created_at FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return res.rows;
}

/**
 * Get the user for a given API key (multi-key system).
 * Returns the user row, or null if not found.
 */
export async function getUserByApiKey(apiKey: string) {
  const res = await pool.query(
    `SELECT u.* FROM users u
     INNER JOIN api_keys k ON u.id = k.user_id
     WHERE k.api_key = $1`,
    [apiKey]
  );
  return res.rows[0] || null;
}
