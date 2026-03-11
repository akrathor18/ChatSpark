import { create } from "zustand";
import * as conversationService from "@/services/conversation.service";

interface ConversationState {
    conversations: any[];
    isLoading: boolean;
    error: any;
    fetchConversations: () => Promise<void>;
    createConversation: (userId: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set) => ({
    conversations: [],
    isLoading: false,
    error: null,

    fetchConversations: async () => {
        try {
            set({ isLoading: true, error: null });

            const res = await conversationService.fetchConversations();
            console.log(res)
            set({
                conversations: res.data,
                isLoading: false,
            });

        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error });
            throw error;
        }
    },

    createConversation: async (userId) => {
        try {
            set({ isLoading: true, error: null });

            const res = await conversationService.createConversation(userId);

            set((state) => ({
                conversations: [res.data, ...state.conversations],
                isLoading: false,
            }));

        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error });
            throw error;
        }
    },
}));