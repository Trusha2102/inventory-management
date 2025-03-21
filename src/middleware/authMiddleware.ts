import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express"; // ✅ Import extended type

const JWT_SECRET = process.env.JWT_SECRET || "6wedfw566wedwe58d4wed";

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    req.user = decoded; // ✅ Now TypeScript recognizes req.user
    return next(); // ✅ Ensure `next()` is always called correctly
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
    return;
  }
};
