import express from "express";
import savedRestaurantController from "../controllers/saved-restaurant-controller.js";
import requireAuth from "../middleware/require-auth.js";

const router = express.Router();

router.get(
  "/users/:userId/saved-restaurants",
  requireAuth,
  savedRestaurantController.getSavedRestaurants
);
router.post(
  "/users/:userId/saved-restaurants",
  requireAuth,
  savedRestaurantController.saveRestaurant
);
router.delete(
  "/users/:userId/saved-restaurants/:restaurantId",
  requireAuth,
  savedRestaurantController.unsaveRestaurant
);

export default router;
