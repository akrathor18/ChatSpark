import { register, login, logout, oauthLogin, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { Router } from "express";
import {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  oauthLimiter,
} from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post("/register",              registerLimiter,      register);
router.post("/login",                 loginLimiter,         login);
router.post("/logout",                                      logout);
router.post("/oauth",                 oauthLimiter,         oauthLogin);
router.post("/forgot-password",       passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, resetPassword);

export default router;