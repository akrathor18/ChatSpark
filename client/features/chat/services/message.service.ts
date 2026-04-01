import api from "@/api/axios";
import { log } from "console";

export const fetchMessages = async (conversationId: string, params?: { limit?: number; before?: string }) => {
    return api.get(`/messages/${conversationId}`, { params });
}

export const sendMessage = async (conversationId: string, content: string) => {
    return api.post(`/messages`, {
        "conversationId": conversationId,
        "content": content
    });
}