import { create } from "zustand";
import * as userService from "@/services/user.service";

interface UserState {
    searchedUsers: any[];
    isSearching: boolean;
    error: any;
    searchUsers: (query: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    searchedUsers: [],
    isSearching: false,
    error: null,

    searchUsers: async (query: string) => {
        try {
            set({ isSearching: true, error: null });
            const res: any = await userService.searchUsers(query);
            set({ searchedUsers: res, isSearching: false });
        } catch (error: any) {
            console.error("Search Users Error:", error);
            set({ isSearching: false, error });
        }
    },
}));
