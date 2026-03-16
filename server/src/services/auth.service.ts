import {User} from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
export const registerUser = async (email: string, password: string, name: string) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error('Email already in use');
    }

    const newUser = new User({ email, password, name });

    const user = await newUser.save();

    const token = generateToken(user);

    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user);

    return { user, token };
};

