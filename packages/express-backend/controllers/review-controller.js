import Review from "../tables/review.js";
import ReviewPhoto from "../tables/review-photo.js";
import Restaurant from "../tables/restaurant.js";
import User from "../tables/user.js";

async function getReviews(req, res) {
  const { restaurantId, userId } = req.query;

  const filter = {};
  if (restaurantId) {
    filter.restaurantId = restaurantId;
  }
  if (userId) {
    filter.userId = userId;
  }

  const reviews = await Review.find(filter)
    .populate("userId", "fullName")
    .populate("restaurantId", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
}

async function getReviewById(req, res) {
  const review = await Review.findById(req.params.id)
    .populate("userId", "fullName")
    .populate("restaurantId", "name");
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  const photos = await ReviewPhoto.find({ reviewId: review._id }).sort({ uploadedAt: 1 });
  res.json({ ...review.toJSON(), photos });
}

async function createReview(req, res) {
  const { userId, restaurantId, rating, timeVisited, whatIGot, title, description } = req.body;

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  const restaurantExists = await Restaurant.exists({ _id: restaurantId });
  if (!restaurantExists) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  const review = await Review.create({
    userId,
    restaurantId,
    rating,
    timeVisited,
    whatIGot,
    title,
    description,
  });
  res.status(201).json(review);
}

async function updateReview(req, res) {
  delete req.body.userId;
  delete req.body.restaurantId;

  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  res.json(review);
}

async function deleteReview(req, res) {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  await ReviewPhoto.deleteMany({ reviewId: review._id });
  res.status(204).end();
}

export default {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
