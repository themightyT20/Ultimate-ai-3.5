import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByUsername, createUser } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const router = Router();

/**
 * POST /api/auth/login
 * Logs in a user and returns a JWT token.
 * Expects { username, password } in body.
 */
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }
  const user = await getUserByUsername(username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Use the exact field from your DB result, likely 'password_hash'
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

/**
 * POST /api/auth/register
 * Registers a new user.
 * Expects { username, password } in body.
 */
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }
  const existing = await getUserByUsername(username);
  if (existing) return res.status(409).json({ error: "Username already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(username, passwordHash);
  res.status(201).json({ id: user.id, username: user.username });
});

export default router;
