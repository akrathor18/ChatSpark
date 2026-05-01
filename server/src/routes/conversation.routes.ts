import {createConversationController, getUserConversationsController, markAsReadController, deleteChatForUserController} from "../controllers/conversation.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/",authMiddleware ,createConversationController);
router.get("/", authMiddleware, getUserConversationsController);
router.patch("/:id/read", authMiddleware, markAsReadController);
router.delete("/:id", authMiddleware, deleteChatForUserController);

export default router;