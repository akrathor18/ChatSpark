import { Server } from "socket.io";
import { registerHandlers } from "./handlers.js";
import { verifyToken } from "../utils/jwt.js";

export const initSocket = (io: Server) => {
  // Authenticate every socket connection before allowing it
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("Unauthorized"));
      }

      const cookies = Object.fromEntries(
        cookieHeader
          .split(";")
          .map((cookie) => cookie.trim())
          .map((cookie) => {
            const index = cookie.indexOf("=");

            return [
              cookie.substring(0, index),
              decodeURIComponent(cookie.substring(index + 1)),
            ];
          })
      );

      const token = cookies.token;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = verifyToken(token);

      if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        return next(new Error("Unauthorized"));
      }

      // Store VERIFIED identity on the socket
      socket.data.userId = decoded.id;

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `Authenticated socket connected: ${socket.id} (user: ${socket.data.userId})`
    );

    registerHandlers(io, socket);
  });
};