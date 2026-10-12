import React, { useState } from "react";
import "./RestaurantExtras.css";

// Placeholder menus for now, matched to the mock restaurants by id.
// Later this should come from the menu-items route.
const mockMenus = {
  1: [
    { name: "Classic Pepperoni Slice", price: "$4.50" },
    { name: "Garlic Bird Pizza", price: "$18.00" },
    { name: "Veggie Pizza", price: "$17.00" },
    { name: "Cinnabread", price: "$7.00" },
  ],
  2: [
    { name: "Tri-Tip Sandwich", price: "$13.00" },
    { name: "Pulled Pork Sandwich", price: "$11.50" },
    { name: "Cheeseburger", price: "$9.00" },
    { name: "Basket of Fries", price: "$5.00" },
  ],
  3: [
    { name: "Carne Asada Taco", price: "$3.50" },
    { name: "Al Pastor Burrito", price: "$10.00" },
    { name: "Veggie Quesadilla", price: "$8.50" },
    { name: "Chips and Salsa", price: "$4.00" },
  ],
  4: [
    { name: "Latte", price: "$5.50" },
    { name: "Cold Brew", price: "$5.00" },
    { name: "Chai", price: "$5.25" },
    { name: "Almond Croissant", price: "$4.75" },
  ],
  5: [
    { name: "Breakfast Burrito", price: "$14.00" },
    { name: "Buttermilk Pancakes", price: "$12.00" },
    { name: "Veggie Scramble", price: "$13.50" },
    { name: "Big Sky Noodle Bowl", price: "$16.00" },
  ],
};

// Big photo on the left, two smaller ones on the right (same layout as the Figma page)
export function RestaurantPhotos() {
  return (
    <div className="rx-photos">
      <div className="rx-photo rx-photo-main">
        <span>IMAGE</span>
        <button className="rx-btn rx-see-all">See all photos</button>
      </div>
      <div className="rx-photo-side">
        <div className="rx-photo">
          <span>Food</span>
        </div>
        <div className="rx-photo">
          <span>Interior</span>
        </div>
      </div>
    </div>
  );
}

// Write a review / Add photos / Save buttons
export function RestaurantActions() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="rx-actions">
      <a className="rx-btn" href="/Review">
        Write a review
      </a>
      {/* TODO: no photo upload yet, this button doesn't do anything */}
      <button className="rx-btn">Add photos</button>
      <button className={saved ? "rx-btn rx-btn-saved" : "rx-btn"} onClick={() => setSaved(!saved)}>
        {saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}

export function RestaurantMenu(props) {
  const items = mockMenus[props.restaurantId] || [];

  return (
    <section id="menu" className="rx-menu">
      <h2>Menu</h2>
      {items.length === 0 && <p>No menu items yet.</p>}
      {items.map((item) => (
        <div key={item.name} className="rx-menu-row">
          <span>{item.name}</span>
          <span>{item.price}</span>
        </div>
      ))}
    </section>
  );
}
