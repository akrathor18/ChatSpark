import * as authServices from "../services/auth.service.js";
import type { Request, Response } from "express";

import type { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const { user, token } = await authServices.registerUser(
            email,
            password,
            name
        );

        res.cookie("token", token, cookieOptions);
        res.status(201).json({ user, token });
    } catch (error: unknown) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Registration failed",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await authServices.loginUser(email, password);

        res.cookie("token", token, cookieOptions);
        res.status(200).json({ user, token });
    } catch (error: unknown) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Login failed",
        });
    }
};

export const oauthLogin = async (req: Request, res: Response) => {
    try {
        const { user, token } = await authServices.oauthLoginService(req.body);

        res.cookie("token", token, cookieOptions);
        res.status(200).json({ user, token });
    } catch (error: unknown) {
        console.error("OAuth login error:", error);

        res.status(500).json({
            message: error instanceof Error ? error.message : "OAuth login failed",
        });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
};


export const forgotPassword = async (req: Request, res: Response) => {
    try {
        await authServices.forgotPasswordService(req.body.email);

        res.status(200).json({
            message: "If this email exists, a reset link has been sent",
        });
    } catch (error: any) {
        console.error("Forgot Password Error:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (typeof token !== "string") {
            res.status(400).json({ error: "Invalid token" });
            return;
        }

        await authServices.resetPasswordService(token, password);

        res.status(200).json({
            message: "Password reset successful",
        });
    } catch (error: any) {
        console.error("Reset Password Error:", error.message);
        res.status(400).json({
            error: error.message,
        });
    }
};