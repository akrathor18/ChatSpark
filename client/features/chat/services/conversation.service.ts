import api from "@/api/axios";

export const fetchConversations = async (userId: string) => {
    return api.get(`/conversations/`);
}

export const createConversation = async (userId: string) => {
    return api.post(`/conversations/`, { userId });
}

export const markAsRead = async (conversationId: string) => {
    return api.patch(`/conversations/${conversationId}/read`);
}