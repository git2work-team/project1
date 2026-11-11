import Review from "../tables/review.js";
import ReviewPhoto from "../tables/review-photo.js";
import Restaurant from "../tables/restaurant.js";
import User from "../tables/user.js";
import e from "cors";

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
  const { userId, restaurantId, rating, description } = req.body;

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
async function voteReview(req, res) {
  const userId = req.body.userId;
  const vote = req.body.vote;
  //error if vote neither -1 nor 1
  if (vote !== 1 && vote !== -1) {
    return res.status(400).json({
      error: "Vote must be 1 or -1",
    });
  }
  const review = await Review.findById(req.params.id);
  //error if review is not found
  if (!review) {
    return res.status(404).json({
      error: "Review not found",
    });
  }
  let existingVote = null;
  //goes through each vote stored on the review
  for (const voteEntry of review.votes) {
    const voterId = voteEntry.userId.toString();
    //if the vote belongs to a current user, remember it
    if (voterId === userId) {
      existingVote = voteEntry;
      break;
    }
  }
  //add a user's vote if they have not voted yet
  //if a user clicks like/dislike twice, remove their vote
  //set user's new vote value otherwise
  if (existingVote === null) {
    review.votes.push({ userId, vote });
  } else if (existingVote.vote === vote) {
    review.votes = review.votes.filter((entry) => entry.userId.toString() !== userId);
  } else {
    existingVote.vote = vote;
  }

  //save changes to MongoDB
  await review.save();
  //send votes to frontend
  res.json({ votes: review.votes });
}

export default {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  voteReview,
};
