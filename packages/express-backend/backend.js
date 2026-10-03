// backend.js
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import restaurantRoutes from "./routes/restaurant-routes.js";
import menuItemRoutes from "./routes/menu-item-routes.js";
import userRoutes from "./routes/user-routes.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/restaurants", restaurantRoutes);
app.use(menuItemRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
