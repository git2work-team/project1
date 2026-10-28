import React from "react";
import "./RestaurantCard.css";


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
              fontSize: props.size || "16px", // Adjusted default size nicely for cards
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

function RestaurantCard({ restaurant, onClick }) {
  const {
    name,
    photoName,
    description,
    address,
    rating = 4.5,
    cuisineLabel,
  } = restaurant;

  return (
    <div 
      className="restaurant-card" 
      onClick={onClick} 
      style={{ cursor: "pointer" }}
    >
      <div className="card-photo-container">
        {photoName ? (
          <img
            src={`/images/${photoName}`}
            alt={name}
            className="card-photo"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        
      </div>

      <div className="card-info">
        <div className="card-header">
          <h3 className="restaurant-name">{name}</h3>
          {cuisineLabel && (
            <span className="cuisine-badge">{cuisineLabel}</span>
          )}
        </div>

    
        <div className="restaurant-rating">
          <Stars rating={rating} size="18px" />
          <span className="rating-score" style={{ marginLeft: "6px" }}>
            {rating.toFixed(1)}
          </span>
        </div>

        <p className="restaurant-description">
          {description || "No description available for this restaurant."}
        </p>

        <div className="restaurant-location">
          <span className="location-icon">📍</span>
          <span className="location-text">{address}</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;