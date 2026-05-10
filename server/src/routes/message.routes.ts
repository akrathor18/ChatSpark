import express from "express";
import { sendMessage, getMessages, unsendMessage, deleteMessageForMe, getMessageInfo } from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:conversationId", authMiddleware, getMessages);
router.patch("/:messageId/unsend", authMiddleware, unsendMessage);
router.patch("/:messageId/delete-for-me", authMiddleware, deleteMessageForMe);
router.get("/:messageId/info", authMiddleware, getMessageInfo);

export default router;