import { Server, Socket } from "socket.io";
import { createMessage } from "../services/message.service.js";
import { isBlockedService } from "../services/block.service.js";
import { ConversationMember } from "../models/conversationMembers.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

interface OnlineUser {
  sockets: Set<string>;
  showOnlineStatus: boolean;
  readReceipts: boolean;
}

const onlineUsers = new Map<string, OnlineUser>();

export const registerHandlers = (io: Server, socket: Socket) => {

  //  Register user room for personal notifications
  socket.on("register_user", async (userId: string) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} registered to user_${userId}`);

      // Fetch user privacy settings
      const user = await User.findById(userId).select("privacySettings");
      const privacy = {
        showOnlineStatus: user?.privacySettings?.showOnlineStatus !== false,
        readReceipts: user?.privacySettings?.readReceipts !== false,
      };

      //  Track multiple sockets
      const isFirstConnection = !onlineUsers.has(userId);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, {
          sockets: new Set(),
          ...privacy,
        });
      }

      onlineUsers.get(userId)!.sockets.add(socket.id);
      socket.data.userId = userId;
      socket.data.privacy = privacy;

      if (isFirstConnection && privacy.showOnlineStatus) {
        // Broadcast to others who have status enabled
        const publicUsers = Array.from(onlineUsers.entries())
          .filter(([id, data]) => id !== userId && data.showOnlineStatus)
          .map(([id]) => id);

        publicUsers.forEach(id => {
          io.to(`user_${id}`).emit("user_online", { userId });
        });
      }
    }
  });

  //  Join conversation room
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
  });

  //  Send message
  socket.on("send_message", async (data) => {
    try {
      const { conversationId, senderId, content, tempId } = data;

      // ✅ validate
      if (!conversationId || !senderId || !content) {
        return;
      }

      // ✅ Check block status before saving
      const otherMember = await ConversationMember.findOne({
        conversationId,
        userId: { $ne: senderId },
      });

      if (otherMember) {
        const blockStatus = await isBlockedService(senderId, otherMember.userId.toString());
        if (blockStatus.blockedByA || blockStatus.blockedByB) {
          socket.emit("message_blocked", { conversationId, tempId });
          return;
        }
      }

      // ✅ save to DB (also restores chat if it was soft-deleted)
      const { message, restoredChat } = await createMessage({
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

      // ✅ If chat was restored from soft-delete, notify members to refresh
      if (restoredChat) {
        members.forEach((member) => {
          const memberId = member.userId.toString();
          io.to(`user_${memberId}`).emit("chatRestored", { conversationId });
        });
      }

    } catch (error) {
      console.error("Socket send_message error:", error);
      // We could emit a "message_failed" event back to the sender here
      socket.emit("message_failed", { tempId: data.tempId, error: "Failed to save message" });
    }
  });


  //  Mark messages as read via socket to notify sender
  socket.on("mark_read", async (data) => {
    const { conversationId, userId } = data;
    if (!conversationId || !userId) return;

    // Reciprocity: If reader has read receipts off, don't update anything
    const reader = onlineUsers.get(userId) || await User.findById(userId).select("privacySettings");
    const readerHasReceipts = (reader as any).readReceipts ?? (reader as any).privacySettings?.readReceipts !== false;

    if (!readerHasReceipts) return;

    // Find messages sent to this user in this conversation that are not read
    const messages = await Message.find({
      conversationId,
      senderId: { $ne: userId },
      status: { $ne: "read" }
    });

    if (messages.length > 0) {
      // Group messages by sender and check their privacy settings
      const senders = [...new Set(messages.map(m => m.senderId.toString()))];
      const publicSenderIds: string[] = [];

      for (const senderId of senders) {
        let senderHasReceipts = true;
        const onlineSender = onlineUsers.get(senderId);

        if (onlineSender) {
          senderHasReceipts = onlineSender.readReceipts;
        } else {
          const senderUser = await User.findById(senderId).select("privacySettings");
          senderHasReceipts = senderUser?.privacySettings?.readReceipts !== false;
        }

        if (senderHasReceipts) {
          publicSenderIds.push(senderId);
        }
      }

      // Only update messages from senders who have read receipts ON
      const messagesToMark = messages.filter(m => publicSenderIds.includes(m.senderId.toString()));

      if (messagesToMark.length > 0) {
        const messageIds = messagesToMark.map(m => m._id);

        // Update statuses in DB
        await Message.updateMany(
          { _id: { $in: messageIds } },
          { $set: { status: "read" } }
        );

        // Notify each public sender
        for (const senderId of publicSenderIds) {
          const senderMessages = messagesToMark.filter(m => m.senderId.toString() === senderId).map(m => m._id);
          if (senderMessages.length > 0) {
            io.to(`user_${senderId}`).emit("messages_read", {
              conversationId,
              readerId: userId,
              messageIds: senderMessages
            });
          }
        }

        // Notify the reader (to sync multiple devices)
        socket.emit("messages_read", {
          conversationId,
          readerId: userId,
          messageIds: messageIds
        });
      }
    }
  });

  //  Handle disconnect
  socket.on("disconnect", async () => {
    const userId = socket.data.userId;
    const privacy = socket.data.privacy;

    if (!userId) return;

    const userData = onlineUsers.get(userId);

    if (userData) {
      userData.sockets.delete(socket.id);

      //  Only if NO sockets left
      if (userData.sockets.size === 0) {
        onlineUsers.delete(userId);

        console.log(`User ${userId} is offline`);

        const lastSeen = new Date();

        await User.findByIdAndUpdate(userId, {
          lastSeen,
        });

        if (privacy?.showOnlineStatus) {
          // Only notify users who have status enabled
          const publicUsers = Array.from(onlineUsers.entries())
            .filter(([id, data]) => data.showOnlineStatus)
            .map(([id]) => id);

          publicUsers.forEach(id => {
            io.to(`user_${id}`).emit("user_offline", { userId, lastSeen });
          });
        }
      }
    }
  });

  socket.on("get_online_users", () => {
    const userId = socket.data.userId;
    const privacy = socket.data.privacy;

    if (!userId || !privacy?.showOnlineStatus) {
      socket.emit("online_users", []);
      return;
    }

    // Only return users who also have status enabled
    const publicUsers = Array.from(onlineUsers.entries())
      .filter(([id, data]) => data.showOnlineStatus)
      .map(([id]) => id);

    socket.emit("online_users", publicUsers);
  });

  socket.on("typing", (data) => {
    const { conversationId, userId } = data;
    const privacy = socket.data.privacy;

    // Reciprocity: If I hide my status, I don't send typing indicators
    if (!privacy?.showOnlineStatus) return;

    // Only broadcast to users who have status enabled
    const publicUsers = Array.from(onlineUsers.entries())
      .filter(([id, d]) => id !== userId && d.showOnlineStatus)
      .map(([id]) => id);

    publicUsers.forEach(id => {
      io.to(`user_${id}`).emit("typing", { conversationId, userId });
    });
  });

  socket.on("stop_typing", (data) => {
    const { conversationId, userId } = data;
    const privacy = socket.data.privacy;

    if (!privacy?.showOnlineStatus) return;

    const publicUsers = Array.from(onlineUsers.entries())
      .filter(([id, d]) => id !== userId && d.showOnlineStatus)
      .map(([id]) => id);

    publicUsers.forEach(id => {
      io.to(`user_${id}`).emit("stop_typing", { conversationId, userId });
    });
  });

};  