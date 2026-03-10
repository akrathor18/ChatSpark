import { create } from "zustand";
import * as authService from "@/services/auth.service";

interface AuthState {
    user: any;
    isLoading: boolean;
    error: any
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });

            const res = await authService.login(email, password);
            console.log(res)

            set({ user: res.user, isLoading: false });
            return true;
        } catch (error: any) {
            console.log(error);

            set({ isLoading: false, error: error });
            throw error;
            return false;
        }
    },
    register: async (name, email, password) => {
        try {
            set({ isLoading: true, error:null });
            const res = await authService.register(name, email, password);
            console.log(res)
            set({ user: res.user, isLoading: false });
            return true;
        } catch (error: any) {
            console.log(error);
            
            set({ isLoading: false, error: error });
            throw error;
            return false;
        }
    },

}));

