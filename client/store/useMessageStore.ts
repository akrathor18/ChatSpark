import { create } from "zustand";
import * as messageService from "@/services/message.service";

interface MessageState {
    messages: any[];
    isLoading: boolean;
    error: any;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendMessage: (conversationId: string, content: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    isLoading: false,
    error: null,    
    fetchMessages: async (conversationId) => {
        try {
            set({ isLoading: true, error: null });
            const res = await messageService.fetchMessages(conversationId);
            console.log(res)
            set({ messages: res.data, isLoading: false });
        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error: error });
            throw error;
        }
    },
    sendMessage: async (conversationId, content) => {
        try {
            set({ isLoading: true, error: null });
            const res = await messageService.sendMessage(conversationId, content);
            set((state) => ({ messages: [...state.messages, res.data], isLoading: false }));
        }

        catch (error: any) {
            console.log(error);
            set({ isLoading: false, error: error });
            throw error;
        }
    },
}));