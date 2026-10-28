import React, { useState, useEffect } from "react";
import "./Homepage.css";
import RestaurantCard from "./RestaurantCard";
import { getRestaurants } from "./api.js";

const SLIDES_TEXT = [
  "Find out what you like",
  "Discover top rated spots in SLO",
  "Save your favorite restaurants",
  "Share your dining reviews"
];


function Homepage(props) {
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [restaurants, setRestaurants] = useState([]);

  //fetch restaurants from the backend
  useEffect(() => {
    getRestaurants()
      .then((data) => {
        // get the top four
        const sortedTopFour = data
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);
        
        setRestaurants(sortedTopFour);
      })
      .catch((error) => console.log("Error fetching top restaurants:", error.message));
  }, []);

  // auto-rotate slides
  useEffect(() => {
    if (restaurants.length === 0) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSlide, restaurants.length]);

  const handleNextSlide = () => {
    if (restaurants.length === 0) return;
    setCurrentSlide((prevSlide) => (prevSlide + 1) % restaurants.length);
  };

  const handlePrevSlide = () => {
    if (restaurants.length === 0) return;
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? restaurants.length - 1 : prevSlide - 1
    );
  };

  //if data is still loading
  if (restaurants.length === 0) {
    return (
      <div className="homepage-container">
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Search restaurants, cuisines..." disabled />
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "50px", color: "#00000" }}>
          Loading top-rated spots...
        </div>
      </div>
    );
  }

  const currentRestaurant = restaurants[currentSlide % restaurants.length];
  const currentText = SLIDES_TEXT[currentSlide % SLIDES_TEXT.length];

  return (
    <div className="homepage-container">
      
      <div className="search-section">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search restaurants, cuisines..."
            disabled
          />
        </div>
      </div>

      <div className="main-banner">
        <div className="banner-left-box">
          <div className="slide-content">
            <h2>{currentText}</h2>
          </div>

          <div className="carousel-controls">
            <div className="dots">
              {restaurants.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        
        <div className="banner-right-box">
          <div className="card-display-area">
            <RestaurantCard 
              restaurant={currentRestaurant} 
              onClick={() => props.openRestaurant(currentRestaurant)} 
            />
          </div>

          
          <div className="bottom-controls-bar">
            <button
              onClick={handlePrevSlide}
              className="arrow-btn-small"
              aria-label="Previous spot"
            >
              ‹
            </button>

            <div className="dots-bottom">
              {restaurants.map((_, index) => (
                <span
                  key={index}
                  className={`mini-dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              className="arrow-btn-small"
              aria-label="Next spot"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;