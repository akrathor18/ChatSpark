import { register, login, logout, oauthLogin, forgotPassword, resetPassword} from '../controllers/auth.controller.js';
import { Router } from "express";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);    
router.post("/oauth", oauthLogin); 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;