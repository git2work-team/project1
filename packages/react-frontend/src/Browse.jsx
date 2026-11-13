import React, { useState, useEffect } from "react";
import { getRestaurants, getCuisines } from "./api.js";
import RestaurantCard from "./RestaurantCard";

function Browse(props) {
  const [searchTerm, setSearchTerm] = useState(props.initialSearch || "");
  const [selectedCuisines, setSelectedCuisines] = useState([]); 
  const [restaurants, setRestaurants] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [cuisinesList, setCuisinesList] = useState([]);

  useEffect(() => {
    getCuisines()
      .then((data) => {
        if (Array.isArray(data)) {
          setCuisinesList(data);
        }
      })
      .catch((err) => console.log("Failed to load cuisines: ", err.message));
  }, []);

  useEffect(() => {
    const filters = {
      search: searchTerm,
      cuisine: selectedCuisines,
    };

    getRestaurants(filters)
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurants(data);
        }
      })
      .catch((error) => console.log(error.message));
  }, [searchTerm, selectedCuisines]);

  const handleCuisineToggle = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCuisines([]);
    setSortBy("");
  };

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
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Browse Restaurants</h1>
      
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

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontWeight: "600", fontSize: "14px", marginRight: "4px" }}>Cuisines:</span>
          {Array.isArray(cuisinesList) &&
            cuisinesList
              .filter((cuisine) => typeof cuisine === "string" && cuisine.trim() !== "")
              .map((cuisine) => {
                const isSelected = selectedCuisines.includes(cuisine);
                return (
                  <button
                    key={cuisine}
                    onClick={() => handleCuisineToggle(cuisine)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: "1px solid #ccc",
                      background: isSelected ? "#287632" : "#f5f5f5",
                      color: isSelected ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isSelected ? "600" : "400",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cuisine} {isSelected}
                  </button>
                );
              })}
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
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
              background: "#e0e0e0",
              color: "#333",
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
        {sortedRestaurants.map((restaurant) => (
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