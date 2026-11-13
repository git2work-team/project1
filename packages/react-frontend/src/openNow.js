// Works out if a restaurant is open right now from its Google opening hours.
// Each period looks like { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 17, minute: 0 } }
// day 0 is Sunday. A place that is open 24/7 has one period with no close.

const MINUTES_IN_WEEK = 7 * 24 * 60;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function minuteOfWeek(time) {
  return time.day * 24 * 60 + (time.hour || 0) * 60 + (time.minute || 0);
}

// Day and time in San Luis Obispo, so the badge is right no matter where the viewer is
function sloTime(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  function get(type) {
    return parts.find((part) => part.type === type).value;
  }

  return {
    day: DAYS.indexOf(get("weekday")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

// Returns true (open), false (closed), or null if we do not have hours for this restaurant
export function isOpenNow(periods, date = new Date()) {
  if (!periods || periods.length === 0) {
    return null;
  }

  const now = minuteOfWeek(sloTime(date));

  for (const period of periods) {
    if (!period.close) {
      return true;
    }
    const open = minuteOfWeek(period.open);
    let close = minuteOfWeek(period.close);
    // A period like Saturday 8pm to Sunday 2am wraps around the end of the week
    if (close <= open) {
      close += MINUTES_IN_WEEK;
    }
    // Also check "now" one week later, for the part of a wrapped period after Sunday midnight
    if (
      (now >= open && now < close) ||
      (now + MINUTES_IN_WEEK >= open && now + MINUTES_IN_WEEK < close)
    ) {
      return true;
    }
  }
  return false;
}
