import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;
interface JwtUser {
    _id: string;
    email: string;
}

export const generateToken = (id: string) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );
};
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
