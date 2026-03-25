import { create } from "zustand";
import * as messageService from "@/features/chat/services/message.service";

interface MessageState {
    messages: Record<string, any[]>;
    isLoading: boolean;
    error: any;
    fetchMessages: (conversationId: string) => Promise<void>;
    addMessage: (msg: any) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    messages: {},
    isLoading: false,
    error: null,
    fetchMessages: async (conversationId) => {
        try {
            set({ isLoading: true, error: null });

            const res: any = await messageService.fetchMessages(conversationId);

            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: res
                },
                isLoading: false
            }));

        } catch (error: any) {
            set({ isLoading: false, error });
        }
    },

    addMessage: (msg: any) =>
        set((state) => {
            const conversationId = msg.conversationId?.toString();
            if (!conversationId) return state;

            const conversationMessages = state.messages[conversationId] || [];
            
            // Deduplicate by _id
            const isDuplicate = conversationMessages.some(
                (m) => m._id?.toString() === msg._id?.toString()
            );

            if (isDuplicate) return state;

            return {
                messages: {
                    ...state.messages,
                    [conversationId]: [...conversationMessages, msg]
                }
            };
        })
}));