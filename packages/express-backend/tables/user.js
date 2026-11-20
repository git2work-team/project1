import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Name is too long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email is too long"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    passwordHash: {
      type: String,
      // people who sign in with Google have no password
      required: function () {
        return !this.googleId;
      },
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    // everything below is optional, so older accounts and new signups work without it
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio is too long"],
      default: "",
    },
    allergies: {
      type: [{ type: String, trim: true, maxlength: [50, "An allergy is too long"] }],
      validate: [(list) => list.length <= 20, "Too many allergies"],
      default: [],
    },
    dislikedFoods: {
      type: [{ type: String, trim: true, maxlength: [50, "A food name is too long"] }],
      validate: [(list) => list.length <= 20, "Too many foods"],
      default: [],
    },
    // Cloudinary photo. null means the person has no profile photo.
    profileImageUrl: {
      type: String,
      trim: true,
      maxlength: [500, "Image link is too long"],
      default: null,
    },
    // Cloudinary's id for the photo, so the old one can be deleted when it is replaced
    profileImagePublicId: {
      type: String,
      trim: true,
      maxlength: [200, "Image id is too long"],
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
