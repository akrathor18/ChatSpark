import {createConversationController, getUserConversationsController} from "../controllers/conversation.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/",authMiddleware ,createConversationController);
router.get("/", authMiddleware, getUserConversationsController);

export default router;