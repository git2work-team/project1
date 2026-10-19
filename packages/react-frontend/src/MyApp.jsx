import React, { useState } from "react";
import WantToTry from "./WantToTry";
import Review from "./Review";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import RestaurantPage from "./RestaurantPage.jsx";
import Browse from "./Browse";
import Login from "./Login";
import Signup from "./Signup";

function MyApp() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  function openRestaurant(restaurant) {
    setSelectedRestaurant(restaurant);
  }

  let content;
  switch (window.location.pathname) {
    case "/Browse":
      content = selectedRestaurant ? (
        <RestaurantPage selectedRestaurant={selectedRestaurant} />
      ) : (
        <Browse openRestaurant={openRestaurant} />
      );
      break;
    case "/Review":
      content = selectedRestaurant ? (
        <RestaurantPage selectedRestaurant={selectedRestaurant} />
      ) : (
        <Review openRestaurant={openRestaurant} />
      );
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
    case "/Login":
      content = <Login />;
      break;
    case "/Signup":
      content = <Signup />;
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
