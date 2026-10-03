import mongoose from "mongoose";

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }

  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  await mongoose.connect(uri);
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
}

export default connectDB;
