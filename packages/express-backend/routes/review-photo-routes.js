import express from "express";
import reviewPhotoController from "../controllers/review-photo-controller.js";

const router = express.Router();

router.get("/reviews/:reviewId/photos", reviewPhotoController.getPhotosByReview);
router.post("/reviews/:reviewId/photos", reviewPhotoController.createReviewPhoto);
router.delete("/review-photos/:id", reviewPhotoController.deleteReviewPhoto);

export default router;
