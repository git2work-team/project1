import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    description: {
      type: String,
      trim: true,
    },
    dietaryOptions: {
      type: String,
      trim: true,
    },
    hours: {
      type: String,
      trim: true,
    },
    // The Google API
    googlePlaceId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    photoName: {
      type: String,
      trim: true,
    },
    photoFetchedAt: {
      type: Date,
    },
    //help with sorting
    cuisine: {
      type: String,
      trim: true,
      index: true,
    },
    cuisineLabel: {
      type: String,
      trim: true,
    },
    types: {
      type: [String],
      default: undefined,
    },
  },
  { timestamps: true }
);

RestaurantSchema.index({ name: 1, address: 1 }, { unique: true });

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
