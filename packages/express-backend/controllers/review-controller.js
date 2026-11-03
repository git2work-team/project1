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

  //finds photos belonging to each review, combines them with that review and sends result to frontend
  const reviewsWithPhotos = [];
  for (const review of reviews) {
    const photos = await ReviewPhoto.find({
      reviewId: review._id,
    }).sort({ uploadedAt: -1 });
    reviewsWithPhotos.push({
      ...review.toJSON(),
      photos,
    });
  }
  res.json(reviewsWithPhotos);
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
  const { restaurantId, rating, description } = req.body;
  const userId = req.user.id;

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  const restaurantExists = await Restaurant.exists({ _id: restaurantId });
  if (!restaurantExists) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  const alreadyReviewed = await Review.exists({ userId, restaurantId });
  if (alreadyReviewed) {
    return res.status(409).json({ error: "You already reviewed this restaurant" });
  }

  try {
    const review = await Review.create({
      userId,
      restaurantId,
      rating,
      description,
    });
    res.status(201).json(review);
  } catch (error) {
    // 11000 = duplicate key, two requests for the same review came in at the same time
    if (error.code === 11000) {
      return res.status(409).json({ error: "You already reviewed this restaurant" });
    }
    throw error;
  }
}

async function updateReview(req, res) {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  if (!review.userId.equals(req.user.id)) {
    return res.status(403).json({ error: "You can only edit your own reviews" });
  }

  const { rating, description } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (description !== undefined) review.description = description;

  await review.save();
  res.json(review);
}

async function deleteReview(req, res) {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  if (!review.userId.equals(req.user.id)) {
    return res.status(403).json({ error: "You can only delete your own reviews" });
  }

  await review.deleteOne();
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
