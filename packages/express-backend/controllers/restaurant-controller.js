import Restaurant from "../tables/restaurant.js";

async function createRestaurant(req, res) {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json(restaurant);
}

async function getRestaurants(req, res) {
  //will also calculate the total rating here
  try {
    const restaurants = await Restaurant.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "restaurantId",
          as: "reviewsList",
        },
      },
      {
        $addFields: {
          reviewsNumber: { $size: "$reviewsList" },
          rating: {
            $cond: {
              if: { $eq: [{ $size: "$reviewsList" }, 0] },
              then: 0,
              else: { $avg: "$reviewsList.rating" },
            },
          },
        },
      },
      {
        $project: {
          reviewsList: 0,
        },
      },
      { $sort: { name: 1 } },
    ]);

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
