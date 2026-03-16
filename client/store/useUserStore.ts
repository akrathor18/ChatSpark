import { create } from "zustand";
import * as userService from "@/services/user.service";
interface UserState {
    user: any;
    searchedUsers: any[];
    isLoading: boolean;
    error: any
    getProfile: () => Promise<void>;
    searchUsers: (query: string) => Promise<void>;
}
export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    searchedUsers: [],
    getProfile: async () => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await userService.getProfile();
            set({ user: res, isLoading: false });
        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error });
        }
    },

    searchUsers: async (query: string) => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await userService.searchUsers(query);
            set({ searchedUsers: res, isLoading: false });
        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error });
        }
    },


}));

