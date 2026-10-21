import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
import { getCurrentUser } from "./auth"; //reads the signed-in user instead of just defaulting to test user
import { getRestaurants, getReviews, createReview, deleteReview } from "./api"; //auth.js provides the current user so removed getUserById

function Review() {
  //use the current account or null when signed out
  const [user] = useState(() => getCurrentUser());
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  //show errors on the page
  const [error, setError] = useState("");

  useEffect(() => {
    //removed the request to load test account

    getRestaurants()
      .then(setRestaurants)
      .catch((error) => setError(error.message));

    // Everyone can read public reviews, whether signed in or not.    
    getReviews()
    .then(setReviews)
    .catch((error) => setError(error.message));
  }, []); // Load restaurants and public reviews when the page opens

async function addReview(review) {
  // Prevent frontend submission when the user is signed out.
  if (!user?._id){
    setError("Please sign in or create an account to write a review.");
    return;
  }
  setError("");
  
  //changed: submit with the signed-in users ID and show any errors
  try {
    await createReview({
      ...review,
      rating: Number(review.rating),
      userId: user._id,
    });
    const updatedReviews = await getReviews();
    setReviews(updatedReviews);
  } catch (error) {
    setError(error.message);
  }  
}
function removeReview(id){
  deleteReview(id)
  .then(() => setReviews(reviews.filter((review) => review._id !== id)))
  .catch((error) => console.log("Deletion failed:", error.message));
}
  return (
    <div className="container">
    {/*new show the account name only when signed in*/}  
    {user?._id && <p>Reviewing as: {user.fullName}</p>}

    {/*show errors where the user can read them*/}
    {error && <p role="alert">{error}</p>}

          {/* CHANGED: Pass the user ID so Delete appears only on their reviews. */}
      <Table
        reviewData={reviews}
        removeReview={removeReview}
        currentUserId={user?._id}
      />

      {/* CHANGED: Show the form only when signed in. */}
      {user?._id ? (
        <Form handleSubmit={addReview} restaurants={restaurants} />
      ) : (
        <p>
          You can browse restaurants and read reviews without an account.
          Please sign in or create an account to write a review.
        </p>
      )}
    </div>
  );
}

export default Review;