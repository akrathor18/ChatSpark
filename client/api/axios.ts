import axios from "axios";
import { deleteCookie } from "cookies-next";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401) {
            // Session expired or not authenticated
            deleteCookie("token");

            if (typeof window !== "undefined") {

                window.location.href = "/sign-in";
            }
        }

        return Promise.reject(error);
    }
);

export default api;