import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const blockUserService = async (blockerId: string, targetId: string) => {
    if (blockerId === targetId) {
        throw new Error("Cannot block yourself");
    }

    const target = await User.findById(targetId);
    if (!target) {
        throw new Error("User not found");
    }

    // $addToSet prevents duplicates
    await User.findByIdAndUpdate(blockerId, {
        $addToSet: { blockedUsers: new mongoose.Types.ObjectId(targetId) },
    });

    return { success: true, message: "User blocked successfully" };
};

export const unblockUserService = async (blockerId: string, targetId: string) => {
    if (blockerId === targetId) {
        throw new Error("Cannot unblock yourself");
    }

    await User.findByIdAndUpdate(blockerId, {
        $pull: { blockedUsers: new mongoose.Types.ObjectId(targetId) },
    });

    return { success: true, message: "User unblocked successfully" };
};

export const getBlockedUsersService = async (userId: string) => {
    const user = await User.findById(userId)
        .populate("blockedUsers", "_id name username avatar")
        .select("blockedUsers");

    if (!user) {
        throw new Error("User not found");
    }

    return user.blockedUsers || [];
};

/**
 * Check block status in both directions.
 * Returns which direction(s) have a block active.
 */
export const isBlockedService = async (
    userAId: string,
    userBId: string
): Promise<{ blockedByA: boolean; blockedByB: boolean }> => {
    const [userA, userB] = await Promise.all([
        User.findById(userAId).select("blockedUsers").lean(),
        User.findById(userBId).select("blockedUsers").lean(),
    ]);

    const blockedByA = userA?.blockedUsers?.some(
        (id: any) => id.toString() === userBId.toString()
    ) ?? false;

    const blockedByB = userB?.blockedUsers?.some(
        (id: any) => id.toString() === userAId.toString()
    ) ?? false;

    return { blockedByA, blockedByB };
};
