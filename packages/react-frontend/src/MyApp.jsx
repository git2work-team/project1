import React, { useState } from "react";
import WantToTry from "./WantToTry";
import Review from "./Review";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import RestaurantPage from "./RestaurantPage.jsx";
import Browse from "./Browse";
import Login from "./Login";
import Signup from "./Signup";
import { getCurrentUser } from "./auth.js";

function MyApp() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // Set while the user is writing a review; shows the Review page for that restaurant
  const [reviewingRestaurant, setReviewingRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  

  function openRestaurant(restaurant) {
    setSelectedRestaurant(restaurant);
  }

  function handleHomepageSearch(query) {
    setSearchQuery(query);
    window.history.pushState({}, "", "/Browse");
  }

  function startReview(restaurant) {
    if (!getCurrentUser()) {
      window.location.href = "/Login";
      return;
    }
    setReviewingRestaurant(restaurant);
  }

  const restaurantPage = selectedRestaurant && (
    <RestaurantPage selectedRestaurant={selectedRestaurant} onReview={startReview} />
  );

  let content;
  switch (window.location.pathname) {
    case "/Browse":
      content = restaurantPage || (<Browse openRestaurant={openRestaurant} initialSearch={searchQuery} />);
      break;
    case "/Review":
      content = restaurantPage || <Review restaurant={null} />;
      break;
    case "/WantToTry":
      content = restaurantPage || <WantToTry openRestaurant={openRestaurant} />;
      break;
    case "/":
      content = restaurantPage || (<Homepage openRestaurant={openRestaurant} onSearch={handleHomepageSearch}/>);
      break;
    case "/Login":
      content = <Login />;
      break;
    case "/Signup":
      content = <Signup />;
      break;
  }

  if (reviewingRestaurant) {
    content = (
      <Review restaurant={reviewingRestaurant} onDone={() => setReviewingRestaurant(null)} />
    );
  }

  return (
    <div className="full-container">
      <Navbar />
      {content}
    </div>
  );
}

export default MyApp;
