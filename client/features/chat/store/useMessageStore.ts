import { create } from "zustand";
import * as messageService from "@/features/chat/services/message.service";

interface MessageState {
    messages: Record<string, any[]>;
    isLoading: boolean;
    error: any;
    fetchMessages: (conversationId: string) => Promise<void>;
    addMessage: (msg: any) => void;
    updateMessage: (conversationId: string, messageId: string, updates: any) => void;
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
            
            // 1. Check if we have an optimistic message with the same tempId
            const optimisticIndex = msg.tempId 
                ? conversationMessages.findIndex((m) => m.tempId === msg.tempId)
                : -1;

            if (optimisticIndex !== -1) {
                // Replace optimistic message with confirmed one
                const updatedMessages = [...conversationMessages];
                updatedMessages[optimisticIndex] = {
                    ...updatedMessages[optimisticIndex],
                    ...msg,
                    status: msg.status || "sent"
                };
                return {
                    messages: {
                        ...state.messages,
                        [conversationId]: updatedMessages
                    }
                };
            }

            // 2. Otherwise check for duplicate by _id
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
        }),

    updateMessage: (conversationId, messageId, updates) =>
        set((state) => {
            const conversationMessages = state.messages[conversationId] || [];
            const updatedMessages = conversationMessages.map((m) => {
                const idMatch = m._id?.toString() === messageId.toString() || m.tempId === messageId;
                if (idMatch) {
                    return { ...m, ...updates };
                }
                return m;
            });

            return {
                messages: {
                    ...state.messages,
                    [conversationId]: updatedMessages
                }
            };
        })
}));