import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto";
import { sendEmail } from "../utils/auth.utils.js";
export const registerUser = async (
    email: string,
    password: string,
    name: string
) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already in use");
    }

    const user = await User.create({
        email,
        password,
        name,
        provider: "local",
    });

    const token = generateToken(user._id.toString());

    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    return { user, token };
};

export const oauthLoginService = async (data: {
    name?: string;
    email?: string;
    image?: string;
    provider?: "google" | "github";
}) => {
    const { name, email, image, provider } = data;

    if (!email) {
        throw new Error("Email is required");
    }

    let user = await User.findOne({ email });

    if (!user) {
        const userData: any = {
            email,
            provider,
        };

        userData.name = name || email.split("@")[0];
        if (image) userData.avatar = image;

        user = await User.create(userData);
    } else {
        if (image) user.avatar = image;
        await user.save();
    }

    const token = generateToken(user._id.toString());

    return { user, token };
};


export const forgotPasswordService = async (email: string) => {
    const user = await User.findOne({ email });

    // Don't reveal if user exists
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Password Reset",
        html: `
            <p>You requested a password reset</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link expires in 15 minutes</p>
        `,
    });
};

export const resetPasswordService = async (
    token: string,
    newPassword: string
) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error("Invalid or expired token");
    }

    user.password = newPassword; // make sure hashing middleware runs
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
};