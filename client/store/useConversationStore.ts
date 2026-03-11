import { create } from "zustand";
import * as conversationService from "@/services/conversation.service";

interface ConversationState {
    conversations: any[];
    members: any[];
    isLoading: boolean;
    error: any;
    fetchConversations: () => Promise<void>;
    createConversation: (userId: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set) => ({
    conversations: [],
    members: [],
    isLoading: false,
    error: null,
    fetchConversations: async () => {
        try {
            set({ isLoading: true, error: null });
            const res = await conversationService.fetchConversations();
            set({ conversations: res.data.conversations, members: res.data.members, isLoading: false });
        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error: error });
            throw error;
        }
    },
    createConversation: async (userId) => {
        try {
            set({ isLoading: true, error: null });


            const res = await conversationService.createConversation(userId);
            set((state) => ({ conversations: [res.data, ...state.conversations], isLoading: false }));
        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error: error });
            throw error;
        }
    },
}));