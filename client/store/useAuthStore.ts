import { create } from "zustand";
import * as authService from "@/services/auth.service"
import { useProfileStore } from "@/features/profile/store/useProfileStore";
interface AuthState {
    isLoading: boolean;
    error: any
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;

}

export const useAuthStore = create<AuthState>((set) => ({
    isLoading: false,
    error: null,

    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });

            const res: any = await authService.login(email, password);
            useProfileStore.getState().setUser(res.user);
            set({ isLoading: false, error: null });
            return true;
        } catch (error: any) {
            console.log(error);

            set({ isLoading: false, error: error });
            return false;
        }
    },
    register: async (name, email, password) => {
        try {
            set({ isLoading: true, error: null });
            const res: any = await authService.register(name, email, password);
            useProfileStore.getState().setUser(res.user);
            set({ isLoading: false, error: null });
            return true;
        } catch (error: any) {
            console.log(error);

            set({ isLoading: false, error: error });
            return false;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true, error: null });
            await authService.logout();
            useProfileStore.getState().clearUser();
            set({ isLoading: false, error: null });
            return true;
        }
        catch (error: any) {
            console.log(error);
            set({ isLoading: false, error: error });
            return false;
        }
    }


}));

