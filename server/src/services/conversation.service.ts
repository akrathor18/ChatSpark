import {Conversation} from "../models/conversations.model.js";
import {ConversationMember} from "../models/conversationMembers.model.js";
import {Message} from "../models/message.model.js";
import { isBlockedService } from "./block.service.js";

import mongoose from "mongoose";

export const createConversationService = async (
  currentUserId: string,
  userId: string
) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  if (currentUserId === userId) {
    throw new Error("Cannot create conversation with yourself");
  }

  // Check block status in both directions
  const blockStatus = await isBlockedService(currentUserId, userId);
  if (blockStatus.blockedByA || blockStatus.blockedByB) {
    throw new Error("Cannot create conversation with this user");
  }

  //  Find user's conversations
  const currentUserConversations = await ConversationMember.find({
    userId: currentUserId,
  }).select("conversationId");

  const conversationIds = currentUserConversations.map(
    (c) => c.conversationId
  );

  // Check existing
  const existingConversation = await ConversationMember.findOne({
    conversationId: { $in: conversationIds },
    userId: userId,
  });

  // EXISTING CASE
  if (existingConversation) {
    const conversation = await Conversation.findById(
      existingConversation.conversationId
    );

    if (!conversation) {
      throw new Error("Conversation not found (data inconsistency)");
    }

    const otherMember = await ConversationMember.findOne({
      conversationId: conversation._id,
      userId: { $ne: currentUserId },
    }).populate("userId", "name email avatar");

    return {
      conversationId: conversation._id,
      user: otherMember?.userId || null,
      type: conversation.type,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      isExisting: true,
    };
  }

  //  CREATE WITH TRANSACTION
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create conversation
    const [newConversation] = await Conversation.create(
      [
        {
          type: "direct",
          createdBy: currentUserId,
        },
      ],
      { session }
    );

    // Add members
    await ConversationMember.insertMany(
      [
        {
          conversationId: newConversation._id,
          userId: currentUserId,
        },
        {
          conversationId: newConversation._id,
          userId: userId,
        },
      ],
      { session }
    );

    //  Commit
    await session.commitTransaction();
    session.endSession();

    // 3. Fetch other user AFTER commit
    const otherMember = await ConversationMember.findOne({
      conversationId: newConversation._id,
      userId: userId,
    }).populate("userId", "name email avatar");

    return {
      conversationId: newConversation._id,
      user: otherMember?.userId || null,
      type: newConversation.type,
      lastMessage: null,
      lastMessageAt: null,
      isExisting: false,
    };

  } catch (error) {
    // Rollback
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getUserConversationsService = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  // Query 1: get conversation IDs the user belongs to
  const memberships = await ConversationMember.find({ userId })
    .select("conversationId lastReadAt")
    .lean();

  if (!memberships.length) return [];

  const conversationIds = memberships.map(m => m.conversationId);
  const lastReadMap = memberships.reduce<Record<string, Date>>((acc, m) => {
    acc[m.conversationId.toString()] = m.lastReadAt;
    return acc;
  }, {});

  // Query 2: get conversations + other members in parallel
  const [conversations, members] = await Promise.all([
    Conversation.find({
      _id: { $in: conversationIds },
      "deletedFor.user": { $ne: userId },
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ConversationMember.find({
      conversationId: { $in: conversationIds },
      userId: { $ne: userId },
    })
      .populate("userId", "name email avatar")
      .lean(),
  ]);

  // Group members by conversationId (supports group chats)
  const memberMap = members.reduce<Record<string, any[]>>((acc, m) => {
    const key = m.conversationId.toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(m.userId);
    return acc;
  }, {});

  // Query 3: Count unread messages for each conversation
  const unreadCounts = await Promise.all(
    conversations.map(async (conv) => {
      const convId = conv._id.toString();
      const lastRead = lastReadMap[convId] || new Date(0);
      
      const count = await Message.countDocuments({
        conversationId: conv._id,
        createdAt: { $gt: lastRead },
        senderId: { $ne: userId }
      });
      
      return { convId, count };
    })
  );

  const unreadMap = unreadCounts.reduce<Record<string, number>>((acc, item) => {
    acc[item.convId] = item.count;
    return acc;
  }, {});

  return conversations.map((conv) => ({
    conversationId: conv._id,
    type: conv.type,
    user: conv.type === "direct"
      ? memberMap[conv._id.toString()]?.[0] ?? null
      : memberMap[conv._id.toString()] ?? [],
    lastMessage: conv.lastMessage,
    lastMessageAt: conv.lastMessageAt,
    unreadCount: unreadMap[conv._id.toString()] || 0
  }));
};

export const markAsReadService = async (conversationId: string, userId: string) => {
    return await ConversationMember.findOneAndUpdate(
        { conversationId, userId },
        { $set: { lastReadAt: new Date() } },
        { new: true }
    );
};

export const deleteChatForUserService = async (conversationId: string, userId: string) => {
    // Validate conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw Object.assign(new Error("Conversation not found"), { status: 404 });
    }

    // Validate user is a participant
    const membership = await ConversationMember.findOne({ conversationId, userId });
    if (!membership) {
        throw Object.assign(new Error("You are not a participant of this conversation"), { status: 403 });
    }

    // $addToSet prevents duplicate entries
    await Conversation.findByIdAndUpdate(conversationId, {
        $addToSet: {
            deletedFor: { user: userId, deletedAt: new Date() },
        },
    });

    return { success: true };
};

export const restoreChatForUsersService = async (conversationId: string) => {
    // Remove all users from deletedFor — chat is restored for everyone
    return await Conversation.findByIdAndUpdate(conversationId, {
        $set: { deletedFor: [] },
    });
};