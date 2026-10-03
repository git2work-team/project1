import ReviewPhoto from "../tables/review-photo.js";
import Review from "../tables/review.js";

async function getPhotosByReview(req, res) {
  const { reviewId } = req.params;

  const reviewExists = await Review.exists({ _id: reviewId });
  if (!reviewExists) {
    return res.status(404).json({ error: "Review not found" });
  }

  const photos = await ReviewPhoto.find({ reviewId }).sort({ uploadedAt: 1 });
  res.json(photos);
}

async function createReviewPhoto(req, res) {
  const { reviewId } = req.params;

  const reviewExists = await Review.exists({ _id: reviewId });
  if (!reviewExists) {
    return res.status(404).json({ error: "Review not found" });
  }

  const photo = await ReviewPhoto.create({ imageUrl: req.body.imageUrl, reviewId });
  res.status(201).json(photo);
}

async function deleteReviewPhoto(req, res) {
  const photo = await ReviewPhoto.findByIdAndDelete(req.params.id);
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.status(204).end();
}

export default {
  getPhotosByReview,
  createReviewPhoto,
  deleteReviewPhoto,
};
