import express from "express";
import reviewPhotoController from "../controllers/review-photo-controller.js";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/reviews/:reviewId/photos", reviewPhotoController.getPhotosByReview);
router.post("/reviews/:reviewId/photos", reviewPhotoController.createReviewPhoto);
router.delete("/review-photos/:id", reviewPhotoController.deleteReviewPhoto);

router.post("/photos-sign", (req, res) => {
  const { api_key, api_secret, cloud_name } = cloudinary.config();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: "review-photos" };
  const signature = cloudinary.utils.api_sign_request(params, api_secret);
  res.json({ signature, timestamp, folder: params.folder, api_key, cloud_name });
});
export default router;
