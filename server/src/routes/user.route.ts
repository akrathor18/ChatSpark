import express from "express";
import * as userController from "../controllers/user.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/upload.middleware.js";
const router = express.Router();

import { rateLimit } from "express-rate-limit";

const usernameCheckLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: { message: "Too many username checks. Please try again later." },
});

router.get("/search", authMiddleware, userController.searchUsers);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/username", authMiddleware, userController.updateUsername);
router.get("/u/:username", userController.getUserByUsername);
router.get("/check-username", authMiddleware, usernameCheckLimiter, userController.checkUsername);
router.post(
    "/upload-profile",
    authMiddleware,
    upload.single("profile"),
    userController.uploadProfilePicController
);

router.delete("/profile-pic", authMiddleware, userController.removeProfilePicController);
router.patch("/notifications", authMiddleware, userController.updateNotificationSettings);
router.patch("/privacy", authMiddleware, userController.updatePrivacySettings);
router.patch("/profile", authMiddleware, userController.updateProfile);
router.post("/change-password", authMiddleware, userController.changePassword);
router.delete("/profile", authMiddleware, userController.deleteAccount);
router.get("/me", authMiddleware, userController.getMeController);
router.post("/block", authMiddleware, userController.blockUserController);
router.post("/unblock", authMiddleware, userController.unblockUserController);
router.get("/blocked", authMiddleware, userController.getBlockedUsersController);
export default router;
