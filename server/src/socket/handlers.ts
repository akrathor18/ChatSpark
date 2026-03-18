import { Server, Socket } from "socket.io";
import { createMessage } from "../services/message.service.js";

export const registerHandlers = (io: Server, socket: Socket) => {

  // 🔹 Join conversation room
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined ${conversationId}`);
  });

  // 🔹 Send message
  socket.on("send_message", async (data) => {
    try {
      const { conversationId, senderId, content } = data;

      // ✅ validate
      if (!conversationId || !senderId || !content) {
        return;
      }

      // ✅ save to DB
      const message = await createMessage({
        conversationId,
        senderId,
        content,
      });

      // ✅ emit to ONLY that conversation
      io.to(conversationId).emit("receive_message", message);

    } catch (error) {
      console.error("Socket send_message error:", error);
    }
  });

};  