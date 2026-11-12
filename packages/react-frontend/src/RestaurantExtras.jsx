import React, { useEffect, useState } from "react";
import "./RestaurantExtras.css";
import { getSavedRestaurants, saveRestaurant, unsaveRestaurant } from "./api";
import { getCurrentUser } from "./auth";

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

// Write a review / Add photos / Save buttons
export function RestaurantActions(props) {
  const [saved, setSaved] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) return;
    getSavedRestaurants(user._id)
      .then((data) => {
        let isSaved = false;
        for (const entry of data) {
          let resturant = entry.restaurantId;
          //if restaurant exists
          if (resturant) {
            //if saved restaurant's id matches the restaurant that the user is viewing
            if (resturant._id === props.restaurantId) {
              isSaved = true;
              break;
            }
          }
        }
        setSaved(isSaved);
      })
      .catch((error) => {
        console.log("Could not load saved restaurant: ", error.message);
      });
  }, [props.restaurantId]);
  // Saves/unsaves the restaurant when a user is clicking a button
  async function toggleSaved() {
    if (!user) {
      window.location.href = "/Login";
      return;
    }
    try {
      if (saved) {
        await unsaveRestaurant(user._id, props.restaurantId);
      } else {
        await saveRestaurant(user._id, props.restaurantId);
      }
      setSaved(!saved);
    } catch (error) {
      console.log("Could not update saved restaurant: ", error.message);
    }
  }
  return (
    <div className="rx-actions">
      <button className="rx-btn" onClick={props.onReview}>
        Write a review
      </button>
      {/* Photos are uploaded with a review, so this opens the review form */}
      <button className="rx-btn" onClick={props.onReview}>
        Add photos
      </button>
      <button className={saved ? "rx-btn rx-btn-saved" : "rx-btn"} onClick={toggleSaved}>
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
//create a restaurant gallery
export function RestaurantPhotos(props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = props.photos || [];
  const mainPhoto = photos[0];
  const [galleryOpen, setGalleryOpen] = useState(false);
  function nextPhoto() {
    setPhotoIndex((current) => (current + 1) % photos.length);
  }
  function prevPhoto() {
    setPhotoIndex((current) => (current - 1 + photos.length) % photos.length);
  }

  return (
    <div>
      <div className="rx-photos">
        <div className="rx-photo rx-photo-main">
          {mainPhoto ? (
            <div>
              <button
                type="button"
                className="rx-photo-preview"
                onClick={() => setGalleryOpen(true)}
                aria-label="Open restaurant photo gallery"
              >
                <div
                  className="rx-photo-track"
                  style={{ transform: `translateX(-${photoIndex * 100}%)` }}
                >
                  {photos.map((photo, index) => (
                    <img
                      key={photo._id}
                      src={photo.imageUrl}
                      alt={`Restaurant review photo ${index + 1}`}
                    />
                  ))}
                </div>
              </button>
              {photos.length > 1 && (
                <div>
                  <button
                    type="button"
                    className="rx-preview-arrow rx-preview-prev"
                    onClick={prevPhoto}
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="rx-preview-arrow rx-preview-next"
                    onClick={nextPhoto}
                    aria-label="Next photo"
                  >
                    →
                  </button>
                </div>
              )}
              <button
                type="button"
                className="rx-btn rx-see-all"
                onClick={() => setGalleryOpen(true)}
              >
                See all photos ({photos.length})
              </button>
            </div>
          ) : (
            <span>No photos yet</span>
          )}
        </div>
      </div>
      {/*shows gallery of photos when galleryOpen is true*/}
      {galleryOpen && (
        <div className="rx-gallery" aria-label="Restaurant photos">
          <button type="button" className="rx-btn" onClick={() => setGalleryOpen(false)}>
            Close gallery
          </button>
          <div className="rx-gallery-grid">
            {photos.map((photo) => (
              <img key={photo._id} src={photo.imageUrl} alt="Restaurant review photo" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
