import api from "@/api/axios";

export const getProfile = async () => {
    return api.get("/users/profile");
}
export const searchUsers = async (query: string) => {
    return api.get(`/users/search?q=${query}`);
}
export const updateUsername = async (username: string) => {
    return api.put("/users/username", { username });
}
export const checkUsername = async (username: string) => {
    return api.get(`/users/check-username?username=${username}`);
}