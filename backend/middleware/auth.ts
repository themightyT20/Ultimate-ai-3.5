import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserByApiKey } from "../src/apiKey";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

/**
 * Middleware to require JWT authentication.
 * Attaches userId to req if token is valid.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const token = auth.slice(7); // Remove "Bearer "
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

/**
 * Middleware to require either JWT or API key authentication.
 * Sets req.user to the user object if valid.
 */
export async function requireUserAuth(req: Request, res: Response, next: NextFunction) {
  // Try JWT first
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7);
      const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
      (req as any).user = { id: payload.userId };
      return next();
    } catch {
      // fall through to API key
    }
  }
  // Try API key
  const apiKey = req.headers["x-api-key"]?.toString();
  if (apiKey) {
    try {
      const user = await getUserByApiKey(apiKey);
      if (user) {
        (req as any).user = user;
        return next();
      }
    } catch {}
  }
  return res.status(401).json({ error: "Unauthorized" });
}
