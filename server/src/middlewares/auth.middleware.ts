import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

try {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as any;

  (req as any).user = decoded;
  next();
} catch (error: any) {
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Session expired. Please login again.",
      expired: true,
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(403).json({
      message: "Invalid token.",
    });
  }

  console.error("Auth Middleware Error:", error);

  return res.status(500).json({
    message: "Internal server error.",
  });
}
};

export default authMiddleware;