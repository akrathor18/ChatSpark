import api from "@/api/axios";

export const fetchMessages = async (conversationId: string, params?: { limit?: number; before?: string }) => {
    return api.get(`/messages/${conversationId}`, { params });
}

export const sendMessage = async (conversationId: string, content: string) => {
    return api.post(`/messages`, {
        "conversationId": conversationId,
        "content": content
    });
}

export const unsendMessage = async (messageId: string) => {
    return api.patch(`/messages/${messageId}/unsend`);
}

export const deleteMessageForMe = async (messageId: string) => {
    return api.patch(`/messages/${messageId}/delete-for-me`);
}

export const getMessageInfo = async (messageId: string) => {
    return api.get(`/messages/${messageId}/info`);
}

export const editMessage = async (messageId: string, content: string) => {
    return api.patch(`/messages/${messageId}/edit`, { content });
}