import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    timeVisited: {
      type: String,
      required: true,
      trim: true,
    },
    whatIGot: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

export default User
