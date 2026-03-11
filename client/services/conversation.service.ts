import api from "@/api/axios";

export const conversations = async (conversationId: string) => {
    return api.get(`/conversations/`);
}

export const createConversation = async (userId: string, ) => {
    return api.post(`/conversations/`, { userId,});
}