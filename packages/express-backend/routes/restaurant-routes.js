import express from "express";
import restaurantController from "../controllers/restaurant-controller.js";
import requireAuth from "../middleware/require-auth.js";

const router = express.Router();

router.get("/", restaurantController.getRestaurants);
router.get("/cuisines", restaurantController.getCuisines);
router.get("/:id", restaurantController.getRestaurantById);
router.post("/", requireAuth, restaurantController.createRestaurant);
router.patch("/:id", requireAuth, restaurantController.updateRestaurant);
router.delete("/:id", requireAuth, restaurantController.deleteRestaurant);

export default router;
