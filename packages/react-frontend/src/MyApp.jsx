import React, { useState } from "react";
import WantToTry from "./WantToTry";
import Review from "./Review";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import RestaurantPage from "./RestaurantPage.jsx";

function MyApp() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  function openRestaurant(restaurant) {
    setSelectedRestaurant(restaurant);
  }

  let content;
  switch (window.location.pathname) {
    case "/Review":
      content = <Review />;
      break;
    case "/WantToTry":
      content = selectedRestaurant ? (
        <RestaurantPage selectedRestaurant={selectedRestaurant} />
      ) : (
        <WantToTry openRestaurant={openRestaurant} />
      );
      break;
    case "/":
      content = <Homepage />;
      break;
  }

  return (
    <div className="full-container">
      <Navbar />
      {content}
    </div>
  );
}

export default MyApp;
