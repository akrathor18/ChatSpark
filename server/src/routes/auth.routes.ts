import { register, login, logout } from '../controllers/auth.controller.js';
import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js';
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);     

export default router;