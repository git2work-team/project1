import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    trim: true
  },
  dietaryOptions: {
    type: String,
    trim: true
  },
},
  { timestamps: true }
);
const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
