import express from "express";
import reviewController from "../controllers/review-controller.js";

const router = express.Router();

router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/", reviewController.createReview);
router.patch("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
