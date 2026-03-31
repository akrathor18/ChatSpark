import express from "express";
import * as userController from "../controllers/user.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/upload.middleware.js";
const router = express.Router();

router.get("/search", authMiddleware, userController.searchUsers);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/username", authMiddleware, userController.updateUsername);
router.get("/check-username", userController.checkUsername);
router.post(
    "/upload-profile",
    authMiddleware,
    upload.single("profile"),
    userController.uploadProfilePicController
);

router.delete("/profile-pic", authMiddleware, userController.removeProfilePicController);

export default router;