import express from "express";
import savedRestaurantController from "../controllers/saved-restaurant-controller.js";

const router = express.Router();

router.get("/users/:userId/saved-restaurants", savedRestaurantController.getSavedRestaurants);
router.post("/users/:userId/saved-restaurants", savedRestaurantController.saveRestaurant);
router.delete(
  "/users/:userId/saved-restaurants/:restaurantId",
  savedRestaurantController.unsaveRestaurant
);

export default router;
