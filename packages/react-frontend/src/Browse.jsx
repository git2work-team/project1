import React, { useState, useEffect } from "react";
import { getRestaurants } from "./api.js";
import RestaurantCard from "./RestaurantCard";

function Browse(props) {
  const [searchTerm, setSearchTerm] = useState(props.initialSearch || "");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [sortBy, setSortBy] = useState([]);

  useEffect(() => {
    const filters = {
      search: searchTerm,
      cuisine: selectedCuisine,
    };

    getRestaurants(filters)
      .then((data) => setRestaurants(data))
      .catch((error) => console.log(error.message));
  }, [searchTerm, selectedCuisine]);


  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCuisine("");
    setSortBy("");
  }

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === "highestRated") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === "mostReviewed") {
      return (b.reviewsNumber || 0) - (a.reviewsNumber || 0);
    }
    if (sortBy === "az") {
      return (a.name || "").localeCompare(b.name || "");
    }
    return 0;
  })

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px", color: "#00000" }}>Browse Restaurants</h1>
      
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "12px", 
          marginBottom: "24px" 
        }}
      >
        
        <input
          type="text"
          placeholder="Search by name, address, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "10px 14px", 
            borderRadius: "8px", 
            border: "1px solid #ccc" 
          }}
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            style={{ 
              flex: "1", 
              minWidth: "150px",
              padding: "10px 14px", 
              borderRadius: "8px", 
              border: "1px solid #ccc" 
            }}
          >
            <option value="">All Cuisines</option>
            <option value="Test">Test</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              flex: "1", 
              minWidth: "150px",
              padding: "10px 14px", 
              borderRadius: "8px", 
              border: "1px solid #ccc" 
            }}
          >
            <option value="">Sort By: Default</option>
            <option value="highestRated">Highest Rated ★</option>
            <option value="mostReviewed">Most Reviewed</option>
            <option value="az">Alphabetical (A-Z)</option>
          </select>

          <button
            onClick={handleClearFilters}
            style={{ 
              padding: "10px 16px", 
              borderRadius: "8px", 
              border: "1px solid #ccc",
              background: "#287632",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>


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
