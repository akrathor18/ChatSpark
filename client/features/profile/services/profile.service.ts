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
