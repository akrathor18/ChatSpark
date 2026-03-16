import { User } from "../models/user.model.js";

export const searchUsers = async (query: string) => {
    if (!query) return [];

    const users = await User.find({
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
    const user = await User.findById(userId).select('-password');
    return user;
}