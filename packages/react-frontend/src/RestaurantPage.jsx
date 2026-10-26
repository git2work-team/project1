import React, { useState, useEffect } from "react";
import "./RestaurantPage.css";
import { RestaurantPhotos, RestaurantActions, RestaurantMenu } from "./RestaurantExtras.jsx";
import { getReviewsByRestaurant } from "./api.js";

function Stars(props) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((idx) => {
        let starFill = props.rating - (idx - 1);
        if (starFill < 0) {
          starFill = 0;
        }
        if (starFill > 1) {
          starFill = 1;
        }
        const starFillPercentage = starFill * 100;
        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              fontSize: props.size || "20px",
              backgroundImage: `linear-gradient(to right, orange ${starFillPercentage}%, lightgray ${starFillPercentage}%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

//calculates rating percentages so that they add up to 100%
function calculateRatingPercentages(props) {
  const ratings = [5, 4, 3, 2, 1];
  let total = 0;

  for (const rating of ratings) {
    total += props.ratingCounts[rating] || 0;
  }

  const results = ratings.map((number) => {
    const reviewsNumber = props.ratingCounts[number] || 0;
    let exactPercentage = 0;

    if (total > 0) {
      exactPercentage = (reviewsNumber / total) * 100;
    }

    const roundedPercentage = Math.floor(exactPercentage);
    const decimal = exactPercentage - roundedPercentage;

    return {
      number,
      roundedPercentage,
      decimal,
    };
  });

  if (total === 0) {
    return results;
  }

  let totalPercentage = 0;

  for (const percentage of results) {
    totalPercentage += percentage.roundedPercentage;
  }

  if (totalPercentage === 100) {
    return results;
  }

  const sorted_results = [...results].sort((a, b) => {
    return b.decimal - a.decimal;
  });

  if (totalPercentage < 100) {
    for (let i = 0; i <= sorted_results.length - 1; i++) {
      if (totalPercentage === 100) {
        break;
      }

      sorted_results[i].roundedPercentage += 1;
      totalPercentage += 1;
    }
  }

  return results;
}

function summarizeReviews(reviews) {
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;

  for (const review of reviews) {
    ratingCounts[Math.floor(review.rating)] += 1;
    total += review.rating;
  }

  return {
    rating: reviews.length > 0 ? total / reviews.length : 0,
    reviewsNumber: reviews.length,
    ratingCounts: ratingCounts,
  };
}

function RestaurantPage(props) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!props.selectedRestaurant._id) {
      return;
    }
    getReviewsByRestaurant(props.selectedRestaurant._id)
      .then(setReviews)
      .catch((error) => console.log(error.message));
  }, [props.selectedRestaurant._id]);

  const reviewSummary = summarizeReviews(reviews);

  const restaurantToOpen = {
    ...props.selectedRestaurant,
    dietaryOptions: props.selectedRestaurant.dietaryOptions || "",
    ...reviewSummary,
  };
  const mapQuery = encodeURIComponent(restaurantToOpen.address);
  const ratingPercentages = calculateRatingPercentages(restaurantToOpen);
  return (
    <main id="overview" className="restaurantPage">
      <div className="restaurantHeader">
        <p>{restaurantToOpen.address}</p>

        <h1>{restaurantToOpen.name}</h1>
      </div>
      <div className="restaurantFeatures">
        <div className="ratingAndPrice">
          <div className="restaurantRating">
            <span>{restaurantToOpen.rating.toFixed(1)}</span>
            <Stars rating={restaurantToOpen.rating} />
            <span> ({restaurantToOpen.reviewsNumber} reviews)</span>
          </div>

          <span>Average price: {restaurantToOpen.avgPrice}</span>
        </div>

        <div className="dietaryTags">
          {restaurantToOpen.dietaryOptions.split(" ").map((item) => (
            <span key={item}>#{item}</span>
          ))}
        </div>
      </div>
      <RestaurantPhotos />
      <RestaurantActions
        restaurantId={props.selectedRestaurant._id}
        onReview={() => props.onReview(props.selectedRestaurant)}
      />
      <nav className="tabs">
        <a href="#overview">Overview</a>
        <a href="#location">Location</a>
        <a href="#hours">Hours</a>
        <a href="#menu">Menu</a>
        <a href="#reviews">Reviews</a>
      </nav>
      <div className="restaurantDetails">
        <section id="about">
          <h2>About</h2>
          <p>{restaurantToOpen.description}</p>
        </section>
        <section className="restaurantContacts">
          <h2>Contact</h2>
          <p>Phone: {restaurantToOpen.phone} </p>
          <p>
            Email: <a href={`mailto:${restaurantToOpen.email}`}>{restaurantToOpen.email}</a>
          </p>
          <p>
            <a href={restaurantToOpen.website} target="_blank" rel="noopener noreferrer">
              Visit Website <span aria-hidden="true">↗</span>
            </a>
          </p>
        </section>
        <section id="location" className="restaurantLocation">
          <h2>Location</h2>
          <div className="locationLayout">
            <a
              className="restaurantMapPreview"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <iframe
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                title={`Location of ${restaurantToOpen.name}`}
                loading="lazy"
                tabIndex={-1}
              />
            </a>
            <p className="locationAddress">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {restaurantToOpen.address}
              </a>
            </p>
          </div>
        </section>
        <section id="hours" className="restaurantHours">
          <h2>Hours</h2>
          <p>{restaurantToOpen.hours}</p>
        </section>
      </div>
      <RestaurantMenu restaurantId={restaurantToOpen.id} />
      <section id="reviews" className="reviews">
        <h2>Reviews</h2>
        <button
          type="button"
          className="reviewCard"
          onClick={() => props.onReview(props.selectedRestaurant)}
        >
          Review {restaurantToOpen.name}
        </button>
        <div className="rating-ratingBars">
          <div className="ratingBox">
            <p>Overall rating ({restaurantToOpen.reviewsNumber})</p>
            <span className="ratingNumber">{restaurantToOpen.rating.toFixed(1)} / 5</span>
            <Stars rating={restaurantToOpen.rating}></Stars>
          </div>
          <div className="ratingBarsBox">
            {ratingPercentages.map((result) => {
              return (
                <div key={result.number} className="ratingBarRow">
                  <span className="ratingBarLabel">{result.number} star</span>
                  <div className="ratingBar">
                    <div
                      className="ratingBarToFill"
                      style={{ width: `${result.roundedPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ratingBarPercentage">{result.roundedPercentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review._id} className="reviewItem">
            <p className="reviewUser">{review.userId?.fullName}</p>
            <div className="reviewRatingDate">
              <Stars rating={review.rating} size="26px" />
              <span className="reviewDate">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="reviewText">{review.description}</p>
            {review.photos?.map((photo) => (
              <img
                key={photo._id}
                className="reviewPhoto"
                src={photo.imageUrl}
                alt="Photo attached to this review"
              ></img>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}
export default RestaurantPage;
