import { create } from "zustand";
import * as conversationService from "@/features/chat/services/conversation.service";

interface ConversationState {
    conversations: any[];
    selectedConversationUser: any | null;
    isLoading: boolean;
    error: any;
    fetchConversations: () => Promise<void>;
    createConversation: (userId: string) => Promise<any>;
    selectedConversation: (userId: string) => any;
    updateConversationFromMessage: (message: any) => void;
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

            const newConv = res.data;

            const formattedConv = {
                conversationId:
                    newConv?.conversationId ||
                    newConv?.conversation?._id ||
                    newConv?._id,
                type: "direct",
                user: newConv?.user || null,
                lastMessage: null,
                lastMessageAt: null,
            };

            set((state) => ({
                conversations: [formattedConv, ...state.conversations],
                isLoading: false,
            }));

            return newConv;
        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error });
            throw error;
        }
    },

    selectedConversation: (id: string) => {
        const { conversations } = get();
        const selectedConv = conversations.find(
            (conv: any) =>
                conv.conversationId?.toString() === id?.toString()
        );

        if (selectedConv && selectedConv.user) {
            set({
                selectedConversationUser: {
                    user: {
                        id: selectedConv.user._id,
                        name: selectedConv.user.name,
                        avatar: selectedConv.user.avatar || "",
                        isOnline: true,
                    },
                },
            });
        } else {
            set({ selectedConversationUser: null });
        }
    },

    updateConversationFromMessage: (message: any) => {
        const { conversations, fetchConversations } = get();
        
        const convIndex = conversations.findIndex(
            (c: any) => c.conversationId?.toString() === message.conversationId?.toString()
        );

        if (convIndex !== -1) {
            const updatedConversations = [...conversations];
            const updatedConv = {
                ...updatedConversations[convIndex],
                lastMessage: message.content,
                lastMessageAt: message.createdAt || new Date().toISOString(),
            };

            // Remove and push to top
            updatedConversations.splice(convIndex, 1);
            set({
                conversations: [updatedConv, ...updatedConversations]
            });
        } else {
            // New conversation or not in list - refresh
            fetchConversations();
        }
    }
}));