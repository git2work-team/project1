import SavedRestaurant from "../tables/saved-restaurant.js";
import Restaurant from "../tables/restaurant.js";
import User from "../tables/user.js";

async function getSavedRestaurants(req, res) {
  const { userId } = req.params;

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  const savedRestaurants = await SavedRestaurant.find({ userId })
    .populate("restaurantId")
    .sort({ savedAt: -1 });
  res.json(savedRestaurants);
}

async function saveRestaurant(req, res) {
  const { userId } = req.params;
  const { restaurantId } = req.body;

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  const restaurantExists = await Restaurant.exists({ _id: restaurantId });
  if (!restaurantExists) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  const savedRestaurant = await SavedRestaurant.create({ userId, restaurantId });
  res.status(201).json(savedRestaurant);
}

async function unsaveRestaurant(req, res) {
  const { userId, restaurantId } = req.params;

  const savedRestaurant = await SavedRestaurant.findOneAndDelete({ userId, restaurantId });
  if (!savedRestaurant) {
    return res.status(404).json({ error: "Saved restaurant not found" });
  }
  res.status(204).end();
}

export default {
  getSavedRestaurants,
  saveRestaurant,
  unsaveRestaurant,
};
