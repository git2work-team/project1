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

  // Set while the user is writing a review; shows the Review page for that restaurant
  const [reviewingRestaurant, setReviewingRestaurant] = useState(null);

  const restaurantPage = selectedRestaurant && (
    <RestaurantPage selectedRestaurant={selectedRestaurant} onReview={setReviewingRestaurant} />
  );

  let content;
  switch (window.location.pathname) {
    case "/Browse":
      content = restaurantPage || <Browse openRestaurant={openRestaurant} />;
      break;
    case "/Review":
      content = restaurantPage || <Review restaurant={null} />;
      break;
    case "/WantToTry":
      content = restaurantPage || <WantToTry openRestaurant={openRestaurant} />;
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
