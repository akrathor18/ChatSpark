import { create } from "zustand";
import * as conversationService from "@/features/chat/services/conversation.service";

interface ConversationState {
    conversations: any[];
    selectedConversationId: string | null;
    selectedConversationUser: any | null;
    isLoading: boolean;
    error: any;
    userStatus: {
        [userId: string]: {
            online: boolean;
            lastSeen?: string;
        };
    };
    typingUsers: {
        [conversationId: string]: {
            [userId: string]: boolean;
        };
    }
    fetchConversations: () => Promise<void>;
    createConversation: (userId: string) => Promise<any>;
    setSelectedConversationId: (id: string | null) => void;
    markAsRead: (id: string) => Promise<void>;
    updateConversationFromMessage: (message: any) => void;
    deleteChatForUser: (conversationId: string) => Promise<void>;
    resetOnlineUsers: () => void;
    setUserOnline: (userId: string, isOnline: boolean, lastSeen?: string) => void;
    setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
    conversations: [],
    selectedConversationId: null,
    selectedConversationUser: null,
    isLoading: false,
    error: null,
    userStatus: {},
    typingUsers: {},

    fetchConversations: async () => {
        try {
            set({ isLoading: true, error: null });

            const res: any = await conversationService.fetchConversations("");
            
            // Handle both { data: [...] } and raw [...]
            const conversationList = Array.isArray(res) 
                ? res 
                : (Array.isArray(res?.data) ? res.data : []);

            set({
                conversations: conversationList,
                isLoading: false,
            });

        } catch (error: any) {
            console.error("ConversationStore: fetchConversations error", error);
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
                unreadCount: 0
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

    setSelectedConversationId: (id: string | null) => {
        const { conversations, userStatus } = get();
        if (!id) {
            set({ selectedConversationId: null, selectedConversationUser: null });
            return;
        }

        const selectedConv = conversations.find(
            (conv: any) => conv.conversationId?.toString() === id.toString()
        );

        set({ selectedConversationId: id });

        if (selectedConv && selectedConv.user) {
            set({
                selectedConversationUser: {
                    user: {
                        id: selectedConv.user._id,
                        name: selectedConv.user.name,
                        email: selectedConv.user.email,
                        avatar: selectedConv.user.avatar || "",
                        isOnline: userStatus[selectedConv.user._id.toString()]?.online || false,
                        lastSeen: userStatus[selectedConv.user._id.toString()]?.lastSeen,
                    },
                },
            });

            // Mark as read when selected
            get().markAsRead(id);
        } else {
            set({ selectedConversationUser: null });
        }
    },

    markAsRead: async (id: string) => {
        try {
            // Optimistic update
            set((state) => ({
                conversations: state.conversations.map((c) =>
                    c.conversationId?.toString() === id.toString()
                        ? { ...c, unreadCount: 0 }
                        : c
                ),
            }));

            await conversationService.markAsRead(id);
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    },

    deleteChatForUser: async (conversationId: string) => {
        const { conversations, selectedConversationId, fetchConversations } = get();

        // Optimistic: remove from state immediately
        const backup = [...conversations];
        set({
            conversations: conversations.filter(
                (c) => c.conversationId?.toString() !== conversationId.toString()
            ),
            // Clear selection if the deleted chat was selected
            ...(selectedConversationId?.toString() === conversationId.toString()
                ? { selectedConversationId: null, selectedConversationUser: null }
                : {}),
        });

        try {
            await conversationService.deleteChatForUser(conversationId);
        } catch (error) {
            console.error("Failed to delete chat:", error);
            // Rollback on failure
            set({ conversations: backup });
        }
    },

    updateConversationFromMessage: (message: any) => {
        const { conversations, selectedConversationId, fetchConversations, markAsRead } = get();

        const convIndex = conversations.findIndex(
            (c: any) => c.conversationId?.toString() === message.conversationId?.toString()
        );

        const isCurrentChat = selectedConversationId?.toString() === message.conversationId?.toString();

        if (convIndex !== -1) {
            const updatedConversations = [...conversations];
            const conversation = updatedConversations[convIndex];

            const updatedConv = {
                ...conversation,
                lastMessage: message.content,
                lastMessageAt: message.createdAt || new Date().toISOString(),
                unreadCount: isCurrentChat ? 0 : (conversation.unreadCount || 0) + 1,
            };

            // Remove and push to top
            updatedConversations.splice(convIndex, 1);
            set({
                conversations: [updatedConv, ...updatedConversations]
            });

            // If it's the current chat, make sure the backend knows it's read
            if (isCurrentChat) {
                markAsRead(message.conversationId);
            }
        } else {
            // New conversation or not in list - refresh
            fetchConversations();
        }
    },

    setUserOnline: (userId, isOnline, lastSeen) => {
        const id = userId.toString();
        set((state) => ({
            userStatus: {
                ...state.userStatus,
                [id]: {
                    online: isOnline,
                    lastSeen,
                },
            },
        }));
    },

    resetOnlineUsers: () => {
        set({ userStatus: {} });
    },
    setTyping: (conversationId, userId, isTyping) => {
        set((state) => {
            const current = state.typingUsers[conversationId] || {};

            if (!isTyping) {
                const { [userId]: _, ...rest } = current;

                return {
                    typingUsers: {
                        ...state.typingUsers,
                        [conversationId]: rest,
                    },
                };
            }

            return {
                typingUsers: {
                    ...state.typingUsers,
                    [conversationId]: {
                        ...current,
                        [userId]: true,
                    },
                },
            };
        });
    },

    resetTyping: () => {
        set({ typingUsers: {} });
    },
}));