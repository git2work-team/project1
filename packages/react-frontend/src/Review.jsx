import React from "react";
import "./Review.css";
import Form from "./Form";
import { TEST_USER_ID } from "./config";
import { createReview } from "./api";

function Review(props) {
  const restaurant = props.restaurant;

  if (!restaurant) {
    return (
      <div className="container reviewPage">
        <p>Pick a restaurant from Browse and press its review card to write a review.</p>
      </div>
    );
  }

  //Add a review (belongs to the test user), then go back to the restaurant page
  function addReview(review) {
    createReview({ ...review, userId: TEST_USER_ID, restaurantId: restaurant._id })
      .then(props.onDone)
      .catch((error) => console.log("Insert failed:", error.message));
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
