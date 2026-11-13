import express from "express";
import userController from "../controllers/user-controller.js";
import requireAuth from "../middleware/require-auth.js";
import { authLimiter } from "../middleware/rate-limit.js";

const router = express.Router();

router.post("/", authLimiter, userController.createUser);
router.post("/login", authLimiter, userController.loginUser);
router.post("/google", authLimiter, userController.googleLogin);
router.get("/:id", requireAuth, userController.getUserById);
router.patch("/:id", requireAuth, userController.updateUser);
router.delete("/:id", requireAuth, userController.deleteUser);

export default router;
