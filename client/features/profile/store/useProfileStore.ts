import { create } from "zustand";
import * as profileService from "../services/profile.service";

interface ProfileState {
    user: any;
    isLoading: boolean;
    isCheckingUsername: boolean;
    isUploadingAvatar: boolean;
    usernameAvailable: boolean | null;
    error: any;
    getProfile: () => Promise<void>;
    checkUsername: (username: string) => Promise<void>;
    updateUsername: (username: string) => Promise<boolean>;
    uploadProfilePic: (file: File) => Promise<boolean>;
    setUser: (user: any) => void;
    clearUser: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    user: null,
    isLoading: false,
    isCheckingUsername: false,
    isUploadingAvatar: false,
    usernameAvailable: null,
    error: null,

    getProfile: async () => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await profileService.getProfile();
            set({ user: res, isLoading: false });
        } catch (error: any) {
            console.error("Get Profile Error:", error);
            set({ isLoading: false, error });
        }
    },

    setUser: (user: any) => set({ user }),

    clearUser: () => set({ user: null }),

    checkUsername: async (username: string) => {
        if (!username) {
            set({ usernameAvailable: null, isCheckingUsername: false });
            return;
        }
        try {
            set({ isCheckingUsername: true, error: null });
            const res: any = await profileService.checkUsername(username);
            set({ usernameAvailable: res.available, isCheckingUsername: false });
        } catch (error: any) {
            console.error("Check Username Error:", error);
            set({ isCheckingUsername: false, usernameAvailable: false, error });
        }
    },

    updateUsername: async (username: string) => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await profileService.updateUsername(username);
            
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

    uploadProfilePic: async (file: File) => {
        try {
            set({ isUploadingAvatar: true, error: null });
            const res: any = await profileService.uploadProfilePic(file);

            // Sync avatar into local user state
            const currentUser = get().user;
            if (currentUser && res?.data) {
                set({
                    user: { ...currentUser, avatar: res.data.avatar, avatarId: res.data.avatarId },
                    isUploadingAvatar: false,
                });
            } else {
                set({ isUploadingAvatar: false });
            }

            return true;
        } catch (error: any) {
            console.error("Upload Profile Pic Error:", error);
            set({ isUploadingAvatar: false, error });
            return false;
        }
    },
}));
