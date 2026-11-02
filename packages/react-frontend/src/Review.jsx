import React, { useState } from "react";
import "./Review.css";
import Form from "./Form";
import { getCurrentUser } from "./auth";
import { createReview, uploadReviewPhoto } from "./api";

function Review(props) {
  const restaurant = props.restaurant;
  const [error, setError] = useState("");

  if (!restaurant) {
    return (
      <div className="container reviewPage">
        <p>Pick a restaurant from Browse and press its review card to write a review.</p>
      </div>
    );
  }

  //Add a review, upload photos (belongs to the test user), then go back to the restaurant page
  async function addReview(review, photos) {
    const user = getCurrentUser();
    if (!user) {
      return;
    }
    setError("");
    try {
      const createdReview = await createReview({
        ...review,
        userId: user._id,
        restaurantId: restaurant._id,
      });
      for (const photo of photos) {
        await uploadReviewPhoto(createdReview._id, photo);
      }
      props.onDone();
    } catch (err) {
      // e.g. "You already reviewed this restaurant" from the backend
      setError(err.message);
    }
  }

  return (
    <div className="container reviewPage">
      <h1 className="reviewRestaurantName">{restaurant.name}</h1>
      <p className="reviewRestaurantAddress">{restaurant.address}</p>
      {error && <p className="reviewError">{error}</p>}
      <Form handleSubmit={addReview} />
    </div>
  );
}

export default Review;
