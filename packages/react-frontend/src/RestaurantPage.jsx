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
    ratingCounts: { 5: 8, 4: 2, 3: 2, 2: 0, 1: 0 },
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
    ratingCounts: { 5: 100, 4: 60, 3: 20, 2: 36, 1: 8 },
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

//calculates rating percentages so that they add up to 100%
function calculateRatingPercentages(props) {
    const ratings = [5, 4, 3, 2, 1];
    let total = 0;

    for (const rating of ratings) {
        total += props.ratingCounts[rating] || 0;
    }

    const results = ratings.map((number) => {
        const reviewsNumber = props.ratingCounts[number] || 0;
        let exactPercentage = 0;

        if (total > 0) {
            exactPercentage = (reviewsNumber / total) * 100;
        }

        const roundedPercentage = Math.floor(exactPercentage);
        const decimal = exactPercentage - roundedPercentage;

        return {
            number, roundedPercentage, decimal
        };
    });

    if (total === 0) {
        return results;
    }

    let totalPercentage = 0;

    for (const percentage of results) {
        totalPercentage += percentage.roundedPercentage;
    }

    if (totalPercentage === 100) {
        return results;
    }

    const sorted_results = [...results].sort((a, b) => {
        return a.decimal - b.decimal;
    });

    if (totalPercentage < 100) {
        for (let i = sorted_results.length - 1; i >= 0; i--) {
            if (totalPercentage === 100) {
                break;
            }

            sorted_results[i].roundedPercentage += 1;
            totalPercentage += 1;
        }
    }

    return results;
}


function RestaurantPage(props) {
  const restaurantToOpen = mockRestaurants.find((item) => item.id === props.selectedRestaurant.id);
  const mapQuery = encodeURIComponent(restaurantToOpen.address);
  const ratingPercentages = calculateRatingPercentages(restaurantToOpen);
  return (
    <main id="overview" className="restaurantPage">
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
      <nav className="tabs">
        <a href="#overview">Overview</a>
        <a href="#location">Location</a>
        <a href="#hours">Hours</a>
        <a href="#menu">Menu</a>
        <a href="#reviews">Reviews</a>
      </nav>
      <div className="restaurantDetails">
        <section id="about">
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
        <section id="location" className="restaurantLocation">
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
        <section id="hours" className="restaurantHours">
          <h2>Hours</h2>
          <p>{restaurantToOpen.hours}</p>
        </section>
      </div>
      <section id="reviews" className="reviews">
        <h2>Reviews</h2>
        <div className="rating-ratingBars">
          <div className="ratingBox">
            <p>Overall rating ({restaurantToOpen.reviewsNumber})</p>
            <span className="ratingNumber">{restaurantToOpen.rating.toFixed(1)} / 5</span>
            <Stars rating={restaurantToOpen.rating}></Stars>
          </div>
          <div className="ratingBarsBox">
          {ratingPercentages.map((result) => {
            return (
                <div key={result.number} className="ratingBarRow">
                  <span>{result.roundedPercentage}%</span>
                  <div className="ratingBar">
                    <div className="ratingBarToFill" style={{ width: `${result.roundedPercentage}%` }}></div>
                  </div>
                </div>
              );
              })}
          </div>
        </div>
      </section>
    </main>
  );
}
export default RestaurantPage;
