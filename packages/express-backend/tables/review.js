import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
      validate: {
        validator: (value) => Number.isInteger(value * 2),
        message: "Rating must be in steps of 0.5",
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Review is too long"],
    },
    votes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        vote: {
          type: Number,
          enum: [-1, 1],
          required: true,
        },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ReviewSchema.index({ restaurantId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
// One review per user per restaurant
ReviewSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
