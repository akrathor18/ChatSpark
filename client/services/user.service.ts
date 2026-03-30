import api from "@/api/axios";

export const searchUsers = async (query: string) => {
    return api.get(`/users/search?q=${query}`);
}