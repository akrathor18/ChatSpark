import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

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