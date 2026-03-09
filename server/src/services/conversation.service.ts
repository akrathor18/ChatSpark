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

export const getUserConversationsService = async (userId: string) => {

  const memberships = await ConversationMember.find({ userId })
    .select("conversationId");

  const conversationIds = memberships.map(m => m.conversationId);

  const conversations = await Conversation.find({
    _id: { $in: conversationIds }
  })
    .populate("lastMessageId")
    .sort({ updatedAt: -1 });

  return conversations;
};