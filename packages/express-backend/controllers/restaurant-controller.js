import Restaurant from "../tables/restaurant.js";

async function createRestaurant(req, res) {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json(restaurant);
}

async function getRestaurants(req, res) {
  try {
    const { search, cuisine } = req.query;
    const matchFilter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      matchFilter.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { description: searchRegex },
        { cuisine: searchRegex },
      ];
    }

    if (cuisine) {
      const cuisineArray = typeof cuisine === "string" ? cuisine.split(",").map(c => c.trim()) : cuisine;   
      const cuisineRegexes = cuisineArray.map(c => new RegExp("^" + c + "$", "i"));
      if (matchFilter.$or) {
        matchFilter.$and = [
          { $or: matchFilter.$or },
          { cuisine: { $in: cuisineRegexes } }
        ];
        delete matchFilter.$or;
      } else {
        matchFilter.cuisine = { $in: cuisineRegexes };
      }
    }

    const restaurants = await Restaurant.aggregate([
      { $match: matchFilter },
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
          isPrefixMatch: search
            ? {
                $cond: {
                  if: {
                    $regexMatch: {
                      input: "$name",
                      regex: new RegExp("^" + search, "i"), 
                    },
                  },
                  then: 0, 
                  else: 1,
                },
              }
            : 0,
        },
      },
      { $project: { reviewsList: 0 } },
      { $sort: { isPrefixMatch: 1, name: 1 } },
    ]);

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCuisines(req, res) {
  try {
    const cuisines = await Restaurant.distinct("cuisine", { 
      cuisine: { $ne: null, $ne: "" } 
    });

    const validCuisines = cuisines
      .filter((c) => typeof c === "string" && c.trim() !== "");

    res.json(validCuisines.sort());
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
  getCuisines,
};
