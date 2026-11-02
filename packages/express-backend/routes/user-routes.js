import express from "express";
import userController from "../controllers/user-controller.js";
import requireAuth from "../middleware/require-auth.js";

const router = express.Router();

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/:id", requireAuth, userController.getUserById);
router.patch("/:id", requireAuth, userController.updateUser);
router.delete("/:id", requireAuth, userController.deleteUser);

export default router;
