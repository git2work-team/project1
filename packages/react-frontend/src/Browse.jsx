import React, { useState, useEffect } from "react";
import { getRestaurants } from "./api.js";

function Browse(props) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getRestaurants()
      .then((data) => setRestaurants(data))
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <div>
      <h1>Browse Restaurants</h1>
      {restaurants.map((restaurant) => {
        return (
          <div
            key={restaurant._id}
            onClick={() => props.openRestaurant(restaurant)}
            style={{
              border: "1px solid gray",
              padding: "12px",
              margin: "8px 0",
              cursor: "pointer",
            }}
          >
            <h3>{restaurant.name}</h3>
            <p>{restaurant.address}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Browse;
