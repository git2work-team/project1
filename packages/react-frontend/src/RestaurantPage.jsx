import React from "react";
import "./RestaurantPage.css";

//Mock Restaurant data
const mockRestaurants = [
  {
    id: 2,
    name: "Firestone Grill",
    address: "1001 Higuera St, San Luis Obispo, CA 93401",
    rating: 4.5,
    reviewsNumber: 12,
    phone: "(620) 123-6781",
    email: "firestone@gmail.com",
    description:
      "Located in the heart of downtown San Luis Obispo, Firestone Grill has been providing its customers with the best possible product at the best possible price since 1995. From our world-famous Tri-tip to our unmatched BBQ and burgers, we pride ourselves on delivering an unforgettable dining experience. We look forward to seeing you soon.",
    dietaryOptions: "Vegetarian Gluten-free",
    hours: [
      "Monday: 9:00 AM – 5:00 PM",
      "Tuesday: 9:00 AM – 5:00 PM",
      "Wednesday: 9:00 AM – 5:00 PM",
      "Thursday: 9:00 AM – 5:00 PM",
      "Friday: 9:00 AM – 5:00 PM",
      "Saturday: 12:00 PM – 7:00 PM",
      "Sunday: 12:00 PM – 7:00 PM",
    ].join("\n"),
    avgPrice: "$",
    website: "https://www.firestonegrill.com/locations/firestone-grill-san-luis-obispo/",
  },
  {
    id: 1,
    name: "Woodstock's Pizza",
    address: "1000 Higuera St, San Luis Obispo, CA 93401",
    rating: 4,
    reviewsNumber: 224,
    phone: "(213) 296-1111",
    email: "woodstock@gmail.com",
    description:
      "Our mission is to earn loyal customers and team members who uniquely regard Woodstock’s as the Ultimate Pizza Experience.",
    dietaryOptions: "Vegan Vegetarian",
    hours: [
      "Monday: 10:00 AM – 8:00 PM",
      "Tuesday: 10:00 AM – 8:00 PM",
      "Wednesday: 10:00 AM – 8:00 PM",
      "Thursday: 10:00 AM – 8:00 PM",
      "Friday: 10:00 AM – 8:00 PM",
      "Saturday: 1:00 PM – 10:00 PM",
      "Sunday: 1:00 PM – 10:00 PM",
    ].join("\n"),
    avgPrice: "$$",
    website: "https://woodstocksslo.com/",
  },
];

function Stars(props) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((idx) => {
        let starFill = props.rating - (idx - 1);
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
  const mapQuery = encodeURIComponent(restaurantToOpen.address);
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
        <section className="restaurantContacts">
          <h2>Contact</h2>
          <p>Phone: {restaurantToOpen.phone} </p>
          <p>
            Email: <a href={`mailto:${restaurantToOpen.email}`}>{restaurantToOpen.email}</a>
          </p>
          <p>
            <a href={restaurantToOpen.website} target="_blank" rel="noopener noreferrer">
              Visit Website <span aria-hidden="true">↗</span>
            </a>
          </p>
        </section>
        <section className="restaurantLocation">
          <h2>Location</h2>
          <div className="locationLayout">
            <a
              className="restaurantMapPreview"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <iframe
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                title={`Location of ${restaurantToOpen.name}`}
                loading="lazy"
                tabIndex={-1}
              />
            </a>
            <p className="locationAddress">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {restaurantToOpen.address}
              </a>
            </p>
          </div>
        </section>
        <section className="restaurantHours">
          <h2>Hours</h2>
          <p>{restaurantToOpen.hours}</p>
        </section>
      </div>
    </main>
  );
}
export default RestaurantPage;
