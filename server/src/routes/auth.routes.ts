import { register, login } from '../controllers/auth.controllers.js';
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;