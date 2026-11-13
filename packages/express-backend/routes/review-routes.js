import express from "express";
import reviewController from "../controllers/review-controller.js";
import requireAuth from "../middleware/require-auth.js";

const router = express.Router();

router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/", requireAuth, reviewController.createReview);
router.patch("/:id", requireAuth, reviewController.updateReview);
router.delete("/:id", requireAuth, reviewController.deleteReview);
router.put("/:id/vote", reviewController.voteReview);

export default router;
