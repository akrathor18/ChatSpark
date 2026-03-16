import api from "@/api/axios";
import { log } from "console";

export const fetchMessages = async (conversationId: string) => {
    return api.get(`/messages/${conversationId}`);
}

export const sendMessage = async (conversationId: string, content: string) => {
    console.log(content)
    return api.post(`/messages`, {
        "conversationId": conversationId,
        "content": content
    });
}