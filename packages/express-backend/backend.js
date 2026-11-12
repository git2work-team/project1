// backend.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./db.js";
import { checkJwtSecret } from "./check-env.js";
import restaurantRoutes from "./routes/restaurant-routes.js";
import menuItemRoutes from "./routes/menu-item-routes.js";
import userRoutes from "./routes/user-routes.js";
import reviewRoutes from "./routes/review-routes.js";
import reviewPhotoRoutes from "./routes/review-photo-routes.js";
import savedRestaurantRoutes from "./routes/saved-restaurant-routes.js";
import { generalLimiter } from "./middleware/rate-limit.js";

const app = express();
// on Render there is one proxy in front of the server, set TRUST_PROXY=1 there
if (process.env.TRUST_PROXY) app.set("trust proxy", Number(process.env.TRUST_PROXY));
const port = process.env.PORT || 8000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));
app.use(generalLimiter);

app.use("/restaurants", restaurantRoutes);
app.use(menuItemRoutes);
app.use("/users", userRoutes);
app.use(savedRestaurantRoutes);
app.use("/reviews", reviewRoutes);
app.use(reviewPhotoRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function startServer() {
  try {
    checkJwtSecret();
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
