import * as authServices from '../services/auth.services.js';

export const register = async (req: any, res: any) => {
    const { email, password, name } = req.body;

    try {
        const { user, token } = await authServices.registerUser(email, password, name);
        res.status(201).json({ user, token });
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }   
};

export const login = async (req: any, res: any) => {
    const { email, password } = req.body;   
    try {
        const { user, token } = await authServices.loginUser(email, password);
        res.status(200).json({ user, token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};