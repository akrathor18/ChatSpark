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

const MESSAGES_LIMIT = 2000;

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

            // Axios interceptor unwraps response.data, so 'res' IS the payload
            const res: any = await messageService.fetchMessages(conversationId, { limit: MESSAGES_LIMIT });
            
            console.log(`Store: Fetched ${res?.length || 0} initial messages for ${conversationId}`, res);
            
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
                    [conversationId]: messageList.length >= MESSAGES_LIMIT
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
        
        if (isLoadingOlder || hasMore[conversationId] === false) return;

        try {
            const conversationMessages = messages[conversationId] || [];
            
            // Can't load older if we have none (use fetchMessages instead)
            if (conversationMessages.length === 0) return;

            const oldestMessage = conversationMessages[0];
            const before = oldestMessage.createdAt;

            if (!before) {
                console.warn("Store: Cannot fetch older, oldest message missing createdAt", oldestMessage);
                return;
            }

            set({ isLoadingOlder: true });
            console.log(`Store: Fetching messages older than ${before} for ${conversationId}`);

            const res: any = await messageService.fetchMessages(conversationId, { 
                limit: MESSAGES_LIMIT, 
                before 
            });
            
            const olderMessages = Array.isArray(res) 
                ? res 
                : (Array.isArray(res?.data) ? res.data : []);

            console.log(`Store: Fetched ${olderMessages.length} older messages`, olderMessages);

            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: [...olderMessages, ...conversationMessages]
                },
                hasMore: {
                    ...state.hasMore,
                    [conversationId]: olderMessages.length >= MESSAGES_LIMIT
                },
                isLoadingOlder: false
            }));

        } catch (error: any) {
            console.error("Store: fetchOlderMessages error", error);
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