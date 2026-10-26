import React from "react";
import "./Review.css";
import Form from "./Form";
import { getCurrentUser } from "./auth";
import { createReview, uploadReviewPhoto } from "./api";

function Review(props) {
  const restaurant = props.restaurant;
  const user = getCurrentUser();

  if (!restaurant) {
    return (
      <div className="container reviewPage">
        <p>Pick a restaurant from Browse and press its review card to write a review.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container reviewPage">
        <p>Please <a href="/Login">log in</a> to write a review.</p>
      </div>
    );
  }

  //Add a review, upload photos (belongs to the logged-in user), then go back to the restaurant page
  async function addReview(review, photos) {
    const createdReview = await createReview({
      ...review,
      userId: user._id,
      restaurantId: restaurant._id,
    });
    for (const photo of photos) {
      await uploadReviewPhoto(createdReview._id, photo);
    }
    props.onDone();
  }

  return (
    <div className="container reviewPage">
      <h1 className="reviewRestaurantName">{restaurant.name}</h1>
      <p className="reviewRestaurantAddress">{restaurant.address}</p>
      <Form handleSubmit={addReview} />
    </div>
  );
}

export default Review;
