import api from "@/api/axios";

export const getProfile = async () => {
    return api.get("/userS/profile");
}
export const searchUsers = async (query: string) => {
    return api.get(`/users/search?q=${query}`);
}