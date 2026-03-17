import express from "express";
import * as userController from "../controllers/user.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get("/search", authMiddleware, userController.searchUsers);
router.get("/profile", authMiddleware, userController.getProfile);

export default router;