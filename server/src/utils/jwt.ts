import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;
interface JwtUser {
    _id: string;
    email: string;
}
export const generateToken = (user: JwtUser) => {
    return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
