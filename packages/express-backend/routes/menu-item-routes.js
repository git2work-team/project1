import express from "express";
import menuItemController from "../controllers/menu-item-controller.js";

const router = express.Router();

router.get("/restaurant/:restaurantId/menu-items", menuItemController.getMenuItemsByRestaurant);
router.post("/restaurants/:restaurantId/menu-items", menuItemController.createMenuItem);
router.patch("/menu-items/:id", menuItemController.updateMenuItem);
router.delete("/menu-items/:id", menuItemController.deleteMenuItem);

export default router;
