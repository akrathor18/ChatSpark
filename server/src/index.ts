import express from "express";
import http from "http";
import { Server } from "socket.io";
import db from "./config/db.js";
import { initSocket } from "./socket/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import conversationRoutes from "./routes/conversation.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cookieParser from "cookie-parser";
import { generalApiLimiter } from "./middlewares/rateLimiter.middleware.js";

import bodyParser from "body-parser";
const app = express();
const server = http.createServer(app);

// Trust the first hop reverse proxy (nginx, Vercel, Render, etc.)
// Required so req.ip returns the real client IP, not the proxy IP.
app.set("trust proxy", 1);

app.use(cookieParser());
app.use(bodyParser.json());
import cors from "cors";

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.send("Hello ChatSpark!");
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

// Global safety net: 200 req / 15 min per IP across all API routes
app.use("/api", generalApiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Global error handler — catches multer/middleware errors that bypass controllers
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Global Error Handler:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ success: false, message });
});

initSocket(io);

server.listen(5000, () => {
  console.log("Server running on port 5000")
})