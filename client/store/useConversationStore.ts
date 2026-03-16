import { create } from "zustand";
import * as conversationService from "@/services/conversation.service";

interface ConversationState {
    conversations: any[];
    selectedConversationUser: any | null;
    isLoading: boolean;
    error: any;
    fetchConversations: () => Promise<void>;
    createConversation: (userId: string) => Promise<void>;
    selectedConversation: (userId: string) => any;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
    conversations: [],
    selectedConversationUser: null,
    isLoading: false,
    error: null,

    fetchConversations: async () => {
        try {
            set({ isLoading: true, error: null });

            const res = await conversationService.fetchConversations("");
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

    selectedConversation: (id: string) => {
        const { conversations } = get();

        const selectedConversation = conversations.find(
            (conv: any) => conv.conversationId === id
        );
        // Expose just the user property with adjusted shape for ChatWindow
        if (selectedConversation && selectedConversation.user) {
            set({
                selectedConversationUser: {
                    user: {
                        id: selectedConversation.user._id,
                        name: selectedConversation.user.name,
                        avatar: selectedConversation.user.avatar || "",
                        isOnline: true // Assuming true for now, can implement proper status later
                    }
                }
            });
        } else {
            set({ selectedConversationUser: null });
        }
    }
}));