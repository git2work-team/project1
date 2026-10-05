import React, { useState } from "react";
import "./WantToTry.css";

// Placeholder data for now. Later this should come from the saved-restaurants route.
const starterSpots = [
  { id: 1, name: "Woodstock's Pizza", tag: "Deal", tried: false },
  { id: 2, name: "Firestone Grill", tag: "Wait time", tried: false },
  { id: 3, name: "Taqueria Santa Cruz", tag: "Deal", tried: false },
  { id: 4, name: "Scout Coffee", tag: "Short wait", tried: false },
  { id: 5, name: "Big Sky Café", tag: "Wait time", tried: false },
];

const deals = [
  "Woodstock's Pizza - deal of the week",
  "Taqueria Santa Cruz - deal of the week",
  "Scout Coffee - student discount",
];

const filters = ["All", "Deals", "Short wait", "Tried"];

function SpotCard(props) {
  const spot = props.spot;
  let tagClass = "wtt-tag";
  if (spot.tag === "Deal") {
    tagClass += " wtt-tag-deal";
  } else if (spot.tag === "Short wait") {
    tagClass += " wtt-tag-short";
  } else {
    tagClass += " wtt-tag-wait";
  }

  return (
    <div className={spot.tried ? "wtt-card wtt-card-tried" : "wtt-card"}>
      <div className="wtt-image">IMAGE</div>
      <div className="wtt-info">
        <h3>{spot.name}</h3>
        <span className={tagClass}>{spot.tag}</span>
      </div>
      <div className="wtt-actions">
        <button className="wtt-btn wtt-btn-orange" onClick={() => props.toggleTried(spot.id)}>
          {spot.tried ? "Tried ✓" : "Mark as tried"}
        </button>
        <button className="wtt-btn wtt-btn-outline" onClick={() => props.removeSpot(spot.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}

function WantToTry() {
  const [spots, setSpots] = useState(starterSpots);
  const [filter, setFilter] = useState("All");

  function toggleTried(id) {
    const updated = spots.map((spot) => {
      if (spot.id === id) {
        return { ...spot, tried: !spot.tried };
      }
      return spot;
    });
    setSpots(updated);
  }

  function removeSpot(id) {
    setSpots(spots.filter((spot) => spot.id !== id));
  }

  const shown = spots.filter((spot) => {
    if (filter === "Deals") return spot.tag === "Deal";
    if (filter === "Short wait") return spot.tag === "Short wait";
    if (filter === "Tried") return spot.tried;
    return true;
  });

  return (
    <div className="wtt-page">
      <h1>My Want-to-Try List</h1>

      <div className="wtt-filters">
        {filters.map((name) => (
          <button
            key={name}
            className={filter === name ? "wtt-pill wtt-pill-active" : "wtt-pill"}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="wtt-body">
        <div className="wtt-list">
          {shown.length === 0 && <p className="wtt-empty">No places here yet.</p>}
          {shown.map((spot) => (
            <SpotCard key={spot.id} spot={spot} toggleTried={toggleTried} removeSpot={removeSpot} />
          ))}
        </div>

        <div className="wtt-deals">
          <h3>Deals this week</h3>
          {deals.map((deal) => (
            <div key={deal} className="wtt-deal-row">
              {deal}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WantToTry;
