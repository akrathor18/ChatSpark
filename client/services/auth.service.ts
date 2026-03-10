import api from "@/api/axios";

export const login = async (email: string, password: string) => {
    return api.post("/auth/login", { email, password });
}

export const register = async (name: string, email: string, password: string) => {
    return api.post("/auth/register", { name, email, password });
}