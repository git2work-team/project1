import React, { useState, useEffect} from "react";
import "./Homepage.css";

const SLIDES_TEXT = [
  "Find out what you like",
  "Discover top rated spots in SLO",
  "Save your favorite restaurants",
  "Share your dining reviews"
];

function Homepage()
{
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			handleNextSlide();
		}, 10000);

		return () => clearInterval(timer);

	}, [currentSlide]);

	const handleNextSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide +1) % SLIDES_TEXT.length);

	};

	return (
		<div className="homepage-container">
      <div className="search-section">
        <div className="search-input-wrapper">
          <span className="search-icon"></span>
          <input
            type="text"
            className="search-input"
            placeholder="Search restaurants, cuisines..."
            disabled
          />
        </div>
      </div>

      <div className="main-banner">
        <div className="banner-left-box" onClick={handleNextSlide}>
          <div className="slide-content">
            <h2>{SLIDES_TEXT[currentSlide]}</h2>
          </div>
          
          <div className="carousel-controls">
            <div className="dots">
              {SLIDES_TEXT.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                />
              ))}
            </div>
            
          </div>
        </div>

        <div className="banner-right-box">
          <div className="restaurant-card-placeholder">
            <div className="logo-placeholder">
              <span>Logo / images</span>
            </div>
          </div>
          <div className="dots-bottom">•••</div>
        </div>
      </div>
    </div>
			

	);
}

export default Homepage;
