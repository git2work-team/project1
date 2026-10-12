import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
import { TEST_USER_ID } from "./config";
import { getUserById, getRestaurants, getReviews, createReview, deleteReview } from "./api";

function Review() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);

  //Load data when the page opens

  function loadReviews() {
    getReviews(TEST_USER_ID)
      .then(setReviews)
      .catch((error) => console.log(error.message));
  }

  useEffect(() => {
    getUserById(TEST_USER_ID)
      .then(setUser)
      .catch((error) => console.log(error.message));

    getRestaurants()
      .then(setRestaurants)
      .catch((error) => console.log(error.message));

    loadReviews();
  }, []);

  //Add a review (belongs to the test user)

  function addReview(review) {
    createReview({ ...review, rating: Number(review.rating), userId: TEST_USER_ID })
      .then(loadReviews) // reload so the new row shows names, not ids
      .catch((error) => console.log("Insert failed:", error.message));
  }

  //Delete a review

  function removeReview(id) {
    deleteReview(id)
      .then(() => setReviews(reviews.filter((review) => review._id !== id)))
      .catch((error) => console.log("Deletion failed:", error.message));
  }

  return (
    <div className="container">
      <p>
        Reviewing as: {user ? user.fullName : "(user not found - check TEST_USER_ID in config.js)"}
      </p>
      <Table reviewData={reviews} removeReview={removeReview} />
      <Form handleSubmit={addReview} restaurants={restaurants} />
    </div>
  );
}

export default Review;
