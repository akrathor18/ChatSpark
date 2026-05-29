import axios from "axios";
import { deleteCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Optional: fail fast if env is missing
if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn("NEXT_PUBLIC_API_URL is not defined");
}

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Self-healing: if backend says unauthorized, clear frontend state
            deleteCookie("token");
            if (typeof window !== "undefined") {
                window.location.href = "/sign-in";
            }
        }

        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        return Promise.reject(message);
    }
);

export default api;