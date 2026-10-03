import MenuItem from "../tables/menu-item.js";
import Restaurant from "../tables/restaurant.js";

async function getMenuItemsByRestaurant(req, res) {
  const { restaurantId } = req.params;

  const restaurantExists = await Restaurant.exists({ _id: restaurantId });
  if (!restaurantExists) {
    return res.status(404).json({ error: "Restaurant not found " });
  }

  const menuItems = await MenuItem.find({ restaurantId }).sort({ name: 1 });
  res.json(menuItems);
}

async function createMenuItem(req, res) {
  const { restaurantId } = req.params;

  const restaurantExists = await Restaurant.exists({ _id: restaurantId });
  if (!restaurantExists) {
    return res.status(404).json({ error: "Restaurant not found " });
  }

  const menuItem = await MenuItem.create({ ...req.body, restaurantId });
  res.status(201).json(menuItem);
}

async function updateMenuItem(req, res) {
  delete req.body.restaurantId;

  const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!menuItem) {
    return res.status(404).json({ error: "Menu item not found" });
  }
  res.json(menuItem);
}

async function deleteMenuItem(req, res) {
  const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
  if (!menuItem) {
    return res.status(404).json({ error: "Menu item not found" });
  }
  res.status(204).end();
}

export default {
  getMenuItemsByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
