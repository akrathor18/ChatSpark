import { create } from "zustand";
import * as messageService from "@/features/chat/services/message.service";

interface MessageState {
    messages: Record<string, any[]>;
    isLoading: boolean;
    isLoadingOlder: boolean;
    hasMore: Record<string, boolean>;
    error: any;
    fetchMessages: (conversationId: string) => Promise<void>;
    fetchOlderMessages: (conversationId: string) => Promise<void>;
    addMessage: (msg: any) => void;
    updateMessage: (conversationId: string, messageId: string, updates: any) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
    messages: {},
    isLoading: false,
    isLoadingOlder: false,
    hasMore: {},
    error: null,
    
    fetchMessages: async (conversationIdInput) => {
        const conversationId = conversationIdInput?.toString();
        if (!conversationId) return;

        try {
            set({ isLoading: true, error: null });

            const limit = 30;
            const res: any = await messageService.fetchMessages(conversationId, { limit });
            console.log("Fetched messages for conversation", conversationId, res);
            const messageList = Array.isArray(res) 
                ? res 
                : (Array.isArray(res?.data) ? res.data : []);

            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: messageList
                },
                hasMore: {
                    ...state.hasMore,
                    [conversationId]: messageList.length >= limit
                },
                isLoading: false
            }));

        } catch (error: any) {
            console.error("Store: fetchMessages error", error);
            set({ isLoading: false, error });
        }
    },

    fetchOlderMessages: async (conversationIdInput) => {
        const conversationId = conversationIdInput?.toString();
        if (!conversationId) return;

        const { messages, hasMore, isLoadingOlder } = get();
        if (isLoadingOlder || !hasMore[conversationId]) return;

        try {
            set({ isLoadingOlder: true });

            const conversationMessages = messages[conversationId] || [];
            const before = conversationMessages[0]?.createdAt;

            if (!before) {
                set({ isLoadingOlder: false });
                return;
            }

            const limit = 30;
            const res: any = await messageService.fetchMessages(conversationId, { 
                limit, 
                before 
            });
            
            const newerMessages = Array.isArray(res) 
                ? res 
                : (Array.isArray(res?.data) ? res.data : []);

            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: [...newerMessages, ...conversationMessages]
                },
                hasMore: {
                    ...state.hasMore,
                    [conversationId]: newerMessages.length >= limit
                },
                isLoadingOlder: false
            }));

        } catch (error: any) {
            console.error("Failed to fetch older messages:", error);
            set({ isLoadingOlder: false });
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
                console.log(`Store: Confirming message [${msg.tempId}] -> [${msg._id}] in ${conversationId}`);
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

            // 2. Otherwise check for duplicate by _id or id
            const newId = msg._id?.toString() || msg.id?.toString();
            const isDuplicate = conversationMessages.some(
                (m) => (m._id?.toString() || m.id?.toString()) === newId
            );

            if (isDuplicate) return state;

            console.log(`Store: Adding new message to ${conversationId}`);
            return {
                messages: {
                    ...state.messages,
                    [conversationId]: [...conversationMessages, msg]
                }
            };
        }),

    updateMessage: (conversationIdInput, messageId, updates) =>
        set((state) => {
            const conversationId = conversationIdInput?.toString();
            if (!conversationId) return state;

            const conversationMessages = state.messages[conversationId] || [];
            const updatedMessages = conversationMessages.map((m) => {
                const targetId = m._id?.toString() || m.id?.toString() || m.tempId;
                const matchId = messageId?.toString();
                
                if (targetId === matchId || m.tempId === matchId) {
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