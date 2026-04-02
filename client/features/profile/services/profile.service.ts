import api from "@/api/axios";

export const getProfile = async () => {
    return api.get("/users/profile");
}

export const updateUsername = async (username: string) => {
    return api.put("/users/username", { username });
}

export const checkUsername = async (username: string) => {
    return api.get(`/users/check-username?username=${username}`);
}

export const uploadProfilePic = async (file: File) => {
    const formData = new FormData();
    formData.append("profile", file);
    return api.post("/users/upload-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export const removeProfilePic = async () => {
    return api.delete("/users/profile-pic");
}

export const updateNotificationSettings = async (settings: any) => {
    return api.patch("/users/notifications", settings);
}

export const updatePrivacySettings = async (settings: any) => {
    return api.patch("/users/privacy", settings);
}

export const changePassword = async (data: any) => {
    return api.post("/users/change-password", data);
}

export const deleteAccount = async () => {
    return api.delete("/users/profile");
}

