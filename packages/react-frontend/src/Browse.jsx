import React, { useState, useEffect } from "react";
import { getRestaurants } from "./api.js";
import RestaurantCard from "./RestaurantCard";

function Browse(props) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getRestaurants()
      .then((data) => setRestaurants(data))
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px", color: "#00000" }}>Browse Restaurants</h1>
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "20px" 
        }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            onClick={() => props.openRestaurant(restaurant)}
          />
        ))}
      </div>
    </div>
  );
}

export default Browse;
