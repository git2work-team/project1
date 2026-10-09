import React from "react";
import "./RestaurantPage.css";

//Mock Restaurant data
const mockRestaurants = [
  {
    id: 2,
    name: "Firestone Grill",
    address: "12345 Str, SLO",
    rating: 4.5,
    reviewsNumber: 12,
    phone: "(620) 123-6781",
    email: "firestone@gmail.com",
    description:
      "Located in the heart of downtown San Luis Obispo, Firestone Grill has been providing its customers with the best possible product at the best possible price since 1995. From our world-famous Tri-tip to our unmatched BBQ and burgers, we pride ourselves on delivering an unforgettable dining experience. We look forward to seeing you soon.",
    dietaryOptions: "Vegetarian Gluten-free",
    hours: "M-F: 9am-5pm \n Saturday-Sunday: 12pm-7pm",
    avgPrice: "$",
  },
  {
    id: 1,
    name: "Woodstock's Pizza",
    address: "2 Main Rd, SLO",
    rating: 4,
    reviewsNumber: 224,
    phone: "(213) 296-1111",
    email: "woodstock@gmail.com",
    description: "some decription",
    dietaryOptions: "Vegan Vegetarian",
    hours: "M-F: 10am-8pm \n Saturday-Sunday: 1pm-10pm",
    avgPrice: "$$",
  },
];

function Stars(props) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((idx) => {
        let starFill = props.rating - idx;
        if (starFill < 0) {
          starFill = 0;
        }
        if (starFill > 1) {
          starFill = 1;
        }
        const starFillPercentage = starFill * 100;
        return (
          <span
            key={idx}
            style={{
              fontSize: "20px",
              background: `linear-gradient(to right, orange ${starFillPercentage}%, lightgray ${starFillPercentage}%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}
function RestaurantPage(props) {
  const restaurantToOpen = mockRestaurants.find((item) => item.id === props.selectedRestaurant.id);

  return (
    <main className="restaurantPage">
      <div className="restaurantHeader">
        <p>{restaurantToOpen.address}</p>

        <h1>{restaurantToOpen.name}</h1>
      </div>
      <div className="restaurantFeatures">
        <div className="ratingAndPrice">
          <div className="restaurantRating">
            <span>{restaurantToOpen.rating.toFixed(1)}</span>
            <Stars rating={restaurantToOpen.rating} />
            <span> ({restaurantToOpen.reviewsNumber} reviews)</span>
          </div>

          <span>Average price: {restaurantToOpen.avgPrice}</span>
        </div>

        <div className="dietaryTags">
          {restaurantToOpen.dietaryOptions.split(" ").map((item) => (
            <span key={item}>#{item}</span>
          ))}
        </div>
      </div>
      <div className="photos"></div>
      <div className="restaurantDetails">
        <section>
          <h2>About</h2>
          <p>{restaurantToOpen.description}</p>
        </section>
        <section>
          <h2>Contacts</h2>
          <p>{restaurantToOpen.phone}</p>
          <p>
            <a href={`mailto:${restaurantToOpen.email}`}>{restaurantToOpen.email}</a>
          </p>
        </section>
      </div>
    </main>
  );
}
export default RestaurantPage;
