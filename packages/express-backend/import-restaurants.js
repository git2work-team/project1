import mongoose from "mongoose";
import connectDB from "./db.js";
import Restaurant from "./tables/restaurant.js";

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

//might change to getting every restaurant in the nearby vicinity
const NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";

//Ask google for what we care about
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.photos.name",
  "places.primaryType",
  "places.primaryTypeDisplayName",
  "places.types",
  "nextPageToken",
].join(",");

//random queries for google to get a good amount of restaurants
const QUERIES = [
  "restaurants in San Luis Obispo, CA",
  "coffee shops in San Luis Obispo, CA",
  "fast food in San Luis Obispo, CA",
];

//keep area in SLO
const SLO_AREA = {
  circle: {
    center: { latitude: 35.2828, longitude: -120.6596 },
    radius: 8000,
  },
};

//google searches restaurants by 20 per page
async function searchPage(query, pageToken) {
  const body = { textQuery: query, pageSize: 20, locationBias: SLO_AREA };
  if (pageToken) {
    body.pageToken = pageToken;
  }

  const response = await fetch(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Google search failed: ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function searchAll(query) {
  const places = [];
  let pageToken; //first pageToken is just the search

  do {
    const data = await searchPage(query, pageToken); //google only searches 20 at a time
    places.push(...(data.places || [])); //data.places will hold all the info part of FIELD MASK
    pageToken = data.nextPageToken;
    if (pageToken) {
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
  } while (pageToken);

  return places;
}

//Cuisine descriptions
const GENERIC_TYPES = new Set([
  "restaurant",
  "food",
  "point_of_interest",
  "establishment",
  "store",
  "meal_takeaway",
  "meal_delivery",
]);

function toLabel(type) {
  //for example turn mexican_restaurant to Mexican Restaurant
  return type
    .split("_")
    .map((word) => {
      word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function pickCuisine(place) {
  if (place.primaryType && !GENERIC_TYPES.has(place.primaryType)) {
    return {
      cuisine: place.primaryType,
      cuisineLabel: place.primaryTypeDisplayName?.text || toLabel(place.primaryType),
    };
  }

  //only gets the places.types that aren't in GENERIC_TYPES
  const specific = (place.types || []).find((type) => !GENERIC_TYPES.has(type));

  if (specific) {
    return { cuisine: specific, cuisineLabel: toLabel(specific) };
  }

  return null;
}

async function saveRestaurant(place) {
  const name = place.displayName?.text;
  const address = place.formattedAddress;
  if (!name || !address) {
    return "skipped";
  }

  const update = { googlePlaceId: place.id, name: name, address: address };

  const photoName = place.photos?.[0]?.name;
  if (photoName) {
    update.photoName = photoName;
    update.photoFetchedAt = new Date();
  }

  const cuisine = pickCuisine(place);
  if (cuisine) {
    update.cuisine = cuisine.cuisine;
    update.cuisineLabel = cuisine.cuisineLabel;
  }

  //filters place.types to only have the ones not in GENERIC_TYPES
  const usefulTypes = (place.types || []).filter((type) => GENERIC_TYPES.has(type));
  if (usefulTypes.length > 0) {
    update.types = usefulTypes;
  }

  const result = await Restaurant.findOneAndUpdate(
    //finds restaurant with either googleId OR same name and address
    { $or: [{ googlePlaceId: place.id }, { name, address }] },
    //changes only the fields in update instead of replacing whole doc
    { $set: update },
    //if no rest. matches, create a new one from update
    { upsert: true, runValidators: true, includeResultMetadata: true }
  );

  return result.lastErrorObject?.updatedExisting ? "updated" : "added";
}

async function importRestaurants() {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    throw new Error("GOOGLE_PLACES_API_KEY is not set in .env");
  }

  await connectDB();

  const seen = new Set();
  const counts = { added: 0, updated: 0, skipped: 0 };

  for (const query of QUERIES) {
    const places = await searchAll(query);
    console.log(`"${query}": ${places.length} results`);

    for (const place of places) {
      if (seen.has(place.id)) {
        continue; //already handled by earlier search
      }
      seen.add(place.id);

      const outcome = await saveRestaurant(place);
      counts[outcome]++;
      console.log(`${outcome}: ${place.displayName?.text}`);
    }
  }
  console.log(`Done. Added ${counts.added}, updated ${counts.updated}, skipped ${counts.skipped}.`);
}

importRestaurants().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
