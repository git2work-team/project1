import React from "react";
import "./OpenNowBadge.css";
import { isOpenNow } from "./openNow";

// Shows "Open now" or "Closed" from the restaurant's opening hours.
// Shows nothing if we do not have hours for this restaurant.
function OpenNowBadge(props) {
  const open = isOpenNow(props.openingHours);
  if (open === null) {
    return null;
  }

  return (
    <span className={open ? "openNowBadge open" : "openNowBadge closed"}>
      {open ? "Open now" : "Closed"}
    </span>
  );
}

export default OpenNowBadge;
