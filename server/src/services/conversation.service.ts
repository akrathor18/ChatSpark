import {Conversation} from "../models/conversations.model.js";
import {ConversationMember} from "../models/conversationMembers.model.js";

export const createConversationService = async (currentUserId: string, userId: string) => {

  if (!userId) {
    throw new Error("UserId is required");
  }

  if (currentUserId === userId) {
    throw new Error("Cannot create conversation with yourself");
  }

  // create conversation
  const conversation = await Conversation.create({
    type: "direct",
    createdBy: currentUserId
  });

  // add members
  await ConversationMember.insertMany([
    {
      conversationId: conversation._id,
      userId: currentUserId
    },
    {
      conversationId: conversation._id,
      userId: userId
    }
  ]);

  return conversation;
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