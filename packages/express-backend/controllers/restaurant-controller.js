import Restaurant from "../tables/restaurant";

async function createRestaurant(req, res) {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json(restaurant);
}

async function getRestaurants(req, res) {
  const restaurants = await Restaurant.find().sort({ name: 1 });
  res.json(restaurants);
}

async function getRestaurantById(req, res) {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }
  res.json(restaurant);
}

async function updateRestaurant(req, res) {
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }
  res.json(restaurant);
}

async function deleteRestaurant(req, res) {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }
  res.status(204).end();
}

export default {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
