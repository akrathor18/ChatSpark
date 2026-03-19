import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    console.log("Decoded Token:", decoded);

    // Map userId to id for backward compatibility with old tokens
    if (decoded.userId && !decoded.id) {
        decoded.id = decoded.userId;
    }

    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(403).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;