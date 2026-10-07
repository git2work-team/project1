import React from "react";
//import ""./RestaurantPage.css";

//Mock Restaurant data
const mockRestaurants = [
    {
  id: 2,
  name: "Firestone Grill",
  address: "12345 Str, SLO",
  rating: 4.5,
  rviewsNumber: 12,
  phone: "(620) 123-6781",
  email: "firestone@gmail.com",
  description:
    "Located in the heart of downtown San Luis Obispo, Firestone Grill has been providing its customers with the best possible product at the best possible price since 1995",
  dietaryOptions: "Vegetarian Gluten-free",
  hours: "M-F: 9am-5pm \n Saturday-Sunday: 12pm-7pm",
},
    {
  id: 1,
  name: "Woodstock's Pizza",
  address: "2 Main Rd, SLO",
  rating: 4,
  rviewsNumber: 224,
  phone: "(213) 296-1111",
  email: "woodstock@gmail.com",
  description:
    "some decription",
  dietaryOptions: "Vegan",
  hours: "M-F: 10am-8pm \n Saturday-Sunday: 1pm-10pm",
},
];

function Stars(props) {
    
  return (
    <span>
      {[1, 2, 3, 4, 5].map((idx) => (
        <div key={idx}>
          <svg
            width="1.5cm"
            height="1.5cm"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="200 0 500 500"
          >
            <polygon
              fill="none"
              idx={idx}
              stroke="black"
              strokeWidth="10"
              points="350,75  379,161 469,161 397,215
                423,301 350,250 277,301 303,215
                231,161 321,161"
            />
          </svg>
        </div>
      ))}
    </span>
  );
}
function RestaurantPage(props) {

  const restaurantToOpen = mockRestaurants.find((item) => item.id === props.selectedRestaurant.id );

  return (
    <main>
      <h1>{restaurantToOpen.name}</h1>
      <p>{restaurantToOpen.address}</p>
      <Stars />
      <p>{restaurantToOpen.description}</p>
    </main>
  );
}
export default RestaurantPage;