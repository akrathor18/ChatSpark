import cloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import type { File } from "multer";
// services/user.service.ts
import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversations.model.js";
import { ConversationMember } from "../models/conversationMembers.model.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import {
    isValidUsername,
    normalizeUsername,
    isReservedUsername,
} from "../utils/username.js";

export const searchUsers = async (query: string, currentUserId: string) => {
    if (!query) return [];

    const normalizedQuery = query.trim().toLowerCase();

    const users = await User.find({
        _id: { $ne: currentUserId },
        $or: [
            { username: { $regex: `^${normalizedQuery}`, $options: "i" } },
            { name: { $regex: `^${normalizedQuery}`, $options: "i" } },
        ]
    })
        .select("_id username name avatar")
        .limit(10);

    return users;
};

export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).select('-password -__v -provider');
    return user;
}

export const checkUsernameAvailabilityService = async (username: string) => {
    const normalized = normalizeUsername(username);

    if (!isValidUsername(normalized)) {
        throw new Error("Invalid username format");
    }

    if (isReservedUsername(normalized)) {
        throw new Error("Username is reserved");
    }

    const existing = await User.findOne({
        $or: [
            { username: normalized },
            { previousUsernames: normalized }
        ]
    });

    return {
        available: !existing,
    };
};

export const updateUsernameService = async (
    userId: string,
    username: string
) => {
    const normalized = normalizeUsername(username);

    if (!isValidUsername(normalized)) {
        throw new Error("Invalid username");
    }

    if (isReservedUsername(normalized)) {
        throw new Error("Username is reserved");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }


    if (user.username === normalized) {
        return user;
    }

    const existing = await User.findOne({
        _id: { $ne: userId },
        $or: [
            { username: normalized },
            { previousUsernames: normalized }
        ]
    });

    if (existing) {
        throw new Error("Username already taken");
    }

    if (user.username) {
        user.previousUsernames.push(user.username);
    }

    user.username = normalized;

    await user.save();

    return user;
};
export const uploadProfilePic = async ({ userId, file }: { userId: string, file: File & { filename: string; path: string } }) => {
    if (!file) {
        return { error: "No file uploaded" };
    }

    const user = await User.findById(userId);
    if (!user) return { notFound: true };

    // Delete old image from Cloudinary
    if (user.avatarId) {
        try {
            await cloudinary.uploader.destroy(user.avatarId);
        } catch (err: any) {          // 👈 fix the unknown type error
            console.warn("Cloudinary delete failed:", err.message);
        }
    }

    // ✅ multer-storage-cloudinary puts the URL in file.path
    // ✅ and the public_id in file.filename
    user.avatar = file.path;
    user.avatarId = file.filename;

    await user.save();

    return {
        avatar: user.avatar,
        avatarId: user.avatarId,
    };
};

export const removeProfilePic = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) return { notFound: true };

    // Delete image from Cloudinary
    if (user.avatarId) {
        try {
            await cloudinary.uploader.destroy(user.avatarId);
        } catch (err: any) {
            console.warn("Cloudinary delete failed:", err.message);
        }
    }

    // Clear avatar fields in database
    user.avatar = undefined;
    user.avatarId = undefined;

    await user.save();

    return {
        success: true,
        message: "Profile picture removed successfully",
    };
};

export const updateNotificationSettings = async (userId: string, settings: any) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.notificationSettings = {
        ...user.notificationSettings,
        ...settings
    };

    await user.save();
    return user.notificationSettings;
};

export const updatePrivacySettings = async (userId: string, settings: any) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.privacySettings = {
        ...user.privacySettings,
        ...settings
    };

    await user.save();
    return user.privacySettings;
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.provider !== "local") {
        throw new Error("Cannot change password for social login accounts");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new Error("Incorrect current password");
    }

    user.password = newPassword;
    await user.save();

    return { success: true, message: "Password updated successfully" };
};

export const updateProfileService = async (userId: string, data: { name?: string; bio?: string }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (data.name) user.name = data.name;
    if (data.bio !== undefined) user.bio = data.bio;

    await user.save();
    return user;
};



export const deleteAccount = async (userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        // Delete avatar (external service, not transactional)
        if (user.avatarId) {
            try {
                await cloudinary.uploader.destroy(user.avatarId);
            } catch (err: any) {
                console.warn("Cloudinary delete failed:", err.message);
            }
        }

        // Cleanup related data (parallel)

        // 1. Find all conversations the user is a member of
        const userConversations = await ConversationMember.find({ userId }).session(session);

        for (const memberRecord of userConversations) {
            const conversationId = memberRecord.conversationId;
            const conversation = await Conversation.findById(conversationId).session(session);

            if (conversation) {
                if (conversation.type === "direct") {
                    // Delete entire 1:1 conversation
                    await Promise.all([
                        Conversation.findByIdAndDelete(conversationId).session(session),
                        Message.deleteMany({ conversationId }).session(session),
                        ConversationMember.deleteMany({ conversationId }).session(session),
                    ]);
                } else {
                    // Group chat: just remove the member mapping
                    await ConversationMember.deleteOne({ _id: memberRecord._id }).session(session);
                }
            }
        }

        // 2. Global Message cleanup: Delete all messages sent by this user (including in groups)
        await Message.deleteMany({ senderId: userId }).session(session);

        // 3. Delete user
        await User.findByIdAndDelete(userId).session(session);

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message: "Account deleted successfully",
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getUserByUsernameService = async (username: string) => {
    const user = await User.findOne({ username: username.toLowerCase() })
        .select("_id username name avatar bio isOnline lastSeen createdAt privacySettings");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


export const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("username email");

    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        isOnboarded: Boolean(user.username && user.username.trim().length > 0),
    };
};