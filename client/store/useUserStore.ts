import { create } from "zustand";
import * as userService from "@/services/user.service";
interface UserState {
    user: any;
    searchedUsers: any[];
    isLoading: boolean;
    isSearching: boolean;
    isCheckingUsername: boolean;
    usernameAvailable: boolean | null;
    error: any
    getProfile: () => Promise<void>;
    searchUsers: (query: string) => Promise<void>;
    checkUsername: (username: string) => Promise<void>;
    updateUsername: (username: string) => Promise<boolean>;
    setUser: (user: any) => void;
    clearUser: () => void;
}
export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    isLoading: false,
    isSearching: false,
    isCheckingUsername: false,
    usernameAvailable: null,
    error: null,
    searchedUsers: [],
    getProfile: async () => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await userService.getProfile();
            console.log("Get Profile Response:", res);
            set({ user: res, isLoading: false });
        } catch (error: any) {
            console.error("Get Profile Error:", error);
            set({ isLoading: false, error });
        }
    },

    setUser: (user: any) => set({ user }),

    clearUser: () => set({ user: null }),

    searchUsers: async (query: string) => {
        try {
            set({ isSearching: true, error: null });
            const res: any = await userService.searchUsers(query);
            set({ searchedUsers: res, isSearching: false });
        } catch (error: any) {
            console.log(error);
            set({ isSearching: false, error });
        }
    },

    checkUsername: async (username: string) => {
        if (!username) {
            set({ usernameAvailable: null, isCheckingUsername: false });
            return;
        }
        try {
            set({ isCheckingUsername: true, error: null });
            const res: any = await userService.checkUsername(username);
            set({ usernameAvailable: res.available, isCheckingUsername: false });
        } catch (error: any) {
            console.error("Check Username Error:", error);
            set({ isCheckingUsername: false, usernameAvailable: false, error });
        }
    },

    updateUsername: async (username: string) => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await userService.updateUsername(username);
            
            // Sync the local user state
            const currentUser = get().user;
            if (currentUser) {
                set({ user: { ...currentUser, username: username }, isLoading: false });
            } else {
                set({ user: res.user, isLoading: false });
            }
            
            return true;
        } catch (error: any) {
            console.error("Update Username Error:", error);
            set({ isLoading: false, error });
            return false;
        }
    },
}));

