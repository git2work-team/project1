import mongoose from "mongoose";

const SavedRestaurantSchema = new mongoose.Schema(
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
      index: true,
    },
  },
  { timestamps: { createdAt: "savedAt", updatedAt: false } }
);

SavedRestaurantSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

const SavedRestaurant = mongoose.model("SavedRestaurant", SavedRestaurantSchema);

export default SavedRestaurant;
