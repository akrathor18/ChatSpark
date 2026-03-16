import { create } from "zustand";
import * as authService from "@/services/auth.service";

interface AuthState {
    user: any;
    isLoading: boolean;
    error: any
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    getProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });

            const res: any = await authService.login(email, password);
            set({ user: res.user, isLoading: false });
            return true;
        } catch (error: any) {
            console.log(error);

            set({ isLoading: false, error: error });
            return false;
        }
    },
    register: async (name, email, password) => {
        try {
            set({ isLoading: true, error:null });
            const res: any = await authService.register(name, email, password);
            set({ user: res.user, isLoading: false });
            return true;
        } catch (error: any) {
            console.log(error);
            
            set({ isLoading: false, error: error });
            return false;
        }
    },

    getProfile: async () => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await authService.getProfile();
            set({ user: res, isLoading: false });
        } catch (error: any) {
            console.log(error);
            set({ isLoading: false, error });
        }
    }

}));

