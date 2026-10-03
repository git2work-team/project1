import mongoose from "mongoose";

const ReviewPhotoSchema = new mongoose.Schema(
  {
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: "uploadedAt", updatedAt: false } }
);

const ReviewPhoto = mongoose.model("ReviewPhoto", ReviewPhotoSchema);

export default ReviewPhoto;
