import { Server, Socket } from "socket.io";
import { createMessage } from "../services/message.service.js";
import { ConversationMember } from "../models/conversationMembers.model.js";

export const registerHandlers = (io: Server, socket: Socket) => {

  // 🔹 Register user room for personal notifications
  socket.on("register_user", (userId: string) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} registered to user_${userId}`);
    }
  });

  // 🔹 Join conversation room
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
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

      // ✅ Find all members of the conversation to notify them
      const members = await ConversationMember.find({ conversationId });

      // ✅ emit to the conversation room (for those currently active in the chat)
      io.to(conversationId).emit("receive_message", message);

      // ✅ Also emit to each member's personal room (for conversation list updates)
      members.forEach((member) => {
        const memberId = member.userId.toString();
        // We emit to user specific room so it can update conversation list
        io.to(`user_${memberId}`).emit("receive_message", message);
      });

    } catch (error) {
      console.error("Socket send_message error:", error);
    }
  });

};  