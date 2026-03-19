import api from "@/api/axios";

export const getProfile = async () => {
    return api.get("/users/profile");
}
export const searchUsers = async (query: string) => {
    return api.get(`/users/search?q=${query}`);
}