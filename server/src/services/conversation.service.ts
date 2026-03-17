import {Conversation} from "../models/conversations.model.js";
import {ConversationMember} from "../models/conversationMembers.model.js";

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
    .select("conversationId")
    .lean();

  if (!memberships.length) return [];

  const conversationIds = memberships.map(m => m.conversationId);

  // Query 2: get conversations + other members in parallel
  const [conversations, members] = await Promise.all([
    Conversation.find({ _id: { $in: conversationIds } })
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

  return conversations.map((conv) => ({
    conversationId: conv._id,
    type: conv.type,
    // For DMs: single user. For groups: array of members
    user: conv.type === "direct"
      ? memberMap[conv._id.toString()]?.[0] ?? null
      : memberMap[conv._id.toString()] ?? [],
    lastMessage: conv.lastMessage,
    lastMessageAt: conv.lastMessageAt,
  }));
};