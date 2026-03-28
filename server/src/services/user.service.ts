import { User } from "../models/user.model.js";
import {
    isValidUsername,
    normalizeUsername,
    isReservedUsername,
} from "../utils/username.js";

export const searchUsers = async (query: string, currentUserId: string) => {
    if (!query) return [];

    const users = await User.find({
        _id: { $ne: currentUserId }, // 👈 exclude current user
        $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } }
        ]
    })
        .select("_id name email avatar")
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

    const existing = await User.findOne({ username: normalized });

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

    const existing = await User.findOne({ username: normalized });

    if (existing) {
        throw new Error("Username already taken");
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username: normalized },
        { new: true }
    );

    return updatedUser;
};