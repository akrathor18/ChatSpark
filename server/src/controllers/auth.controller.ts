import * as authServices from '../services/auth.services.js';
import type { Request, Response } from "express";
export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        const { user, token } = await authServices.registerUser(email, password, name);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(201).json({ user, token });
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await authServices.loginUser(email, password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(200).json({ user, token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const user = await authServices.getUserProfile(userId);
        res.status(200).json(user);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
}