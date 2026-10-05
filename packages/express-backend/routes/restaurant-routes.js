import express from "express";
import restaurantController from "../controllers/restaurant-controller.js";

const router = express.Router();

router.get("/", restaurantController.getRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.post("/", restaurantController.createRestaurant);
router.patch("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

export default router;
