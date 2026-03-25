import { Server, Socket } from "socket.io";
import { createMessage } from "../services/message.service.js";
import { ConversationMember } from "../models/conversationMembers.model.js";
import { Message } from "../models/message.model.js";

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
      const { conversationId, senderId, content, tempId } = data;

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

      // Convert message to plain object and add tempId
      const finalMessage = {
          ...message.toObject(),
          tempId: tempId
      };

      // ✅ Find all members of the conversation to notify them
      const members = await ConversationMember.find({ conversationId });

      // ✅ emit to the conversation room (including sender if they're in the room)
      io.to(conversationId).emit("receive_message", finalMessage);

      // ✅ Also emit to each member's personal room (for conversation list updates)
      members.forEach((member) => {
        const memberId = member.userId.toString();
        // Skip if it's the sender and we already emitted to conversation room?
        // Actually, emitting to user specific room is safer for notification consistency.
        if (memberId !== senderId) {
            io.to(`user_${memberId}`).emit("receive_message", finalMessage);
        }
      });

    } catch (error) {
      console.error("Socket send_message error:", error);
      // We could emit a "message_failed" event back to the sender here
      socket.emit("message_failed", { tempId: data.tempId, error: "Failed to save message" });
    }
  });

  // 🔹 Mark messages as read via socket to notify sender
  socket.on("mark_read", async (data) => {
    const { conversationId, userId } = data;
    if (!conversationId || !userId) return;

    // Find messages sent to this user in this conversation that are not read
    const messages = await Message.find({
        conversationId,
        senderId: { $ne: userId },
        status: { $ne: "read" }
    });

    if (messages.length > 0) {
        // Update statuses in DB
        await Message.updateMany(
            { _id: { $in: messages.map(m => m._id) } },
            { $set: { status: "read" } }
        );

        // Notify each sender that their message was read
        // For simplicity, we can just notify the entire conversation room or specific senders
        // Notifying the conversation room is sufficient if participants filter locally
        io.to(conversationId).emit("messages_read", {
            conversationId,
            readerId: userId,
            messageIds: messages.map(m => m._id)
        });
    }
  });

};  