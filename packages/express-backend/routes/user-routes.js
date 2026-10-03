import express from "express";
import userController from "../controllers/user-controller.js";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
