import { create } from "zustand";
import * as profileService from "../services/profile.service";

interface ProfileState {
    user: any;
    isLoading: boolean;
    isCheckingUsername: boolean;
    isUploadingAvatar: boolean;
    usernameAvailable: boolean | null;
    usernameMessage: string | null;
    error: any;
    getProfile: () => Promise<void>;
    checkUsername: (username: string) => Promise<void>;
    updateUsername: (username: string) => Promise<boolean>;
    updateProfile: (data: { name: string, bio: string }) => Promise<boolean>;
    uploadProfilePic: (file: File) => Promise<boolean>;
    removeProfilePic: () => Promise<boolean>;
    updateNotificationSettings: (settings: any) => Promise<boolean>;
    updatePrivacySettings: (settings: any) => Promise<boolean>;
    changePassword: (data: any) => Promise<boolean>;
    deleteAccount: () => Promise<boolean>;
    setUser: (user: any) => void;
    clearUser: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    user: null,
    isLoading: false,
    isCheckingUsername: false,
    isUploadingAvatar: false,
    usernameAvailable: null,
    usernameMessage: null,
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
            set({ isCheckingUsername: true, error: null, usernameMessage: null, usernameAvailable: null });
            const res: any = await profileService.checkUsername(username);
            set({ 
                usernameAvailable: res.available, 
                usernameMessage: res.message,
                isCheckingUsername: false 
            });
        } catch (error: any) {
            console.error("Check Username Error:", error);
            set({ 
                isCheckingUsername: false, 
                usernameAvailable: false, 
                usernameMessage: error.response?.data?.message || "Error checking username",
                error 
            });
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
            const message = error.response?.data?.message || error.message || "Failed to update username";
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    updateProfile: async (data: { name: string, bio: string }) => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await profileService.updateProfile(data);
            
            // Sync the local user state
            const currentUser = get().user;
            if (currentUser) {
                set({ user: { ...currentUser, name: data.name, bio: data.bio }, isLoading: false });
            } else {
                set({ user: res.user, isLoading: false });
            }
            
            return true;
        } catch (error: any) {
            console.error("Update Profile Error:", error);
            const message = error.response?.data?.message || error.message || "Failed to update profile";
            set({ isLoading: false, error: message });
            throw new Error(message);
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

    removeProfilePic: async () => {
        try {
            set({ isLoading: true, error: null });
            await profileService.removeProfilePic();

            // Sync local user state
            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: { ...currentUser, avatar: undefined, avatarId: undefined },
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }

            return true;
        } catch (error: any) {
            console.error("Remove Profile Pic Error:", error);
            set({ isLoading: false, error });
            return false;
        }
    },

    updateNotificationSettings: async (settings: any) => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await profileService.updateNotificationSettings(settings);

            // Sync local user state
            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: { ...currentUser, notificationSettings: res.settings },
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }

            return true;
        } catch (error: any) {
            console.error("Update Notification Settings Error:", error);
            set({ isLoading: false, error });
            return false;
        }
    },

    updatePrivacySettings: async (settings: any) => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await profileService.updatePrivacySettings(settings);

            // Sync local user state
            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: { ...currentUser, privacySettings: res.settings },
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }

            return true;
        } catch (error: any) {
            console.error("Update Privacy Settings Error:", error);
            set({ isLoading: false, error });
            return false;
        }
    },

    changePassword: async (data: any) => {
        try {
            set({ isLoading: true, error: null });
            await profileService.changePassword(data);
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            console.error("Change Password Error:", error);
            set({ isLoading: false, error: error.response?.data?.message || "Password update failed" });
            return false;
        }
    },

    deleteAccount: async () => {
        try {
            set({ isLoading: true, error: null });
            await profileService.deleteAccount();
            set({ user: null, isLoading: false });
            return true;
        } catch (error: any) {
            console.error("Delete Account Error:", error);
            set({ isLoading: false, error });
            return false;
        }
    },
}));

