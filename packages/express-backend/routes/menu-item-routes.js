import express from "express";
import menuItemController from "../controllers/menu-item-controller.js";
import requireAuth from "../middleware/require-auth.js";

const router = express.Router();

router.get("/restaurant/:restaurantId/menu-items", menuItemController.getMenuItemsByRestaurant);
router.post(
  "/restaurants/:restaurantId/menu-items",
  requireAuth,
  menuItemController.createMenuItem
);
router.patch("/menu-items/:id", requireAuth, menuItemController.updateMenuItem);
router.delete("/menu-items/:id", requireAuth, menuItemController.deleteMenuItem);

export default router;
