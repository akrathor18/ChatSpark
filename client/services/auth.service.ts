import api from "@/api/axios";
type OAuthUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: "google" | "github";
};
export const login = async (email: string, password: string) => {
    return api.post("/auth/login", { email, password });
}

export const register = async (name: string, email: string, password: string) => {
    return api.post("/auth/register", { name, email, password });
}

export const oauthLogin = async (user: OAuthUser) => {
    return await api.post("/auth/oauth", user);
};