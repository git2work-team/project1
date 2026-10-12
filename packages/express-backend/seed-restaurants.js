const restaurants = [
  {
    name: "Red Radish",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name:"1901 Kitchen",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name:"Kai Poke",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name:"Julian's",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name:"Poly Choice",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name: "Pom & Honey",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name: "Chick-fil-A",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name: "Panda Express",
    address: "1901 Marketplace, 1 Grand Ave Bldg 19, San Luis Obispo, CA 93407",
  },
  {
    name: "The Deli at Market Grand Ave",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",
  },
  {
    name: "Balance Café",
    address:"Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",
  },
  {
    name: "Brunch",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",
    
  },
  {
    name: "Hearth",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",

  },
  {
    name: "Jamba",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",

  },
  {
    name: "Mingle + Nosh",
    address: "Noodles"
  },
  {
    name: "Streats",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",

  },
  {
    name: "Chef's Table",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",

  },
  {
    name: "Sweet Bar",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",

  },
  {
    name: "Vista Grande Express",
    address: "Vista Grande Dining Complex, 1 Grand Ave, Bldg 112, San Luis Obispo, CA 93407",

  },
  {
    name: "Subway",
    address: "Dexter Building, Room 111A, San Luis Obispo, CA 93407",

  },
  {
    name: "Wednesday BBQ (at Campus Market Grill)",
    address: "1 Grand Avenue, Building 24 San Luis Obispo, CA 93405 Located inside Kennedy Library Neighborhood",

  },
  {
    name: "Campus Market",
    address: "1 Grand Ave Bldg 24, San Luis Obispo, CA 93405",
  },
  {
    name: "Health Shack",
    address: "1 Grand Ave Bldg 24, San Luis Obispo, CA 93405",

  },
  {
    name: "Sequel",
    address: "1 Grand Ave Bldg 24, San Luis Obispo, CA 93405",

  },
  {
    name: "Jewel of India",
    address: '1 Grand Ave San Luis Obispo, CA 93407, Located inside PAC Circle',

  },
  {
    name: "Shake Smart",
    address: "101 Longview Ln, San Luis Obispo, CA 93405",
  },
  {
    name: "Starbucks",
    address: "1 Grand Avenue, Building 65 San Luis Obispo, CA 93407, Located inside University Union Neighborhood",

  },
  {
    name: "Scout's Coffee",
    address: "1 Grand Ave, Building 172H San Luis Obispo, CA 93407 Located inside yakʔitʸutʸu Neighborhood",

  },
  {
    name: "G. Brothers Taqueria",
    address: "1 Grand Avenue San Luis Obispo, CA  93405, Located inside Mott Lawn",
  },
  {
    name: "Health Shack",
    address: "1 Grand Avenue, Building 34B San Luis Obispo, CA 93405, Located inside Kennedy Library Neighborhood",

  },
  {
    name: "Plant Ivy",
    address: "S Poly View Dr San Luis Obispo, CA 93405, Located inside Mott Lawn",

  },
  {
    name: "What's Cookin' Kosher",
    address: "1 Grand Avenue San Luis Obispo, CA 93405 Located inside Mott Lawn",

  },
  {
    name: "Einstein Bros. Bagels",
    address: "1 Grande Ave, Building 171B San Luis Obispo, CA 93407, Located inside Poly Canyon Village",
  },
  {
    name: "Hilltop",
    address: "1 Grande Ave, Building 171B San Luis Obispo, CA 93407, Located inside Poly Canyon Village",
  },
  {
    name: "Taco Bell",
    address:"1 Grand Avenue, Building 171I San Luis Obispo, CA 93407, Located inside Poly Canyon Village",
  },

];

async function seedRestaurants() {
  const url = "http://localhost:8000/restaurants";

  // Load restaurants already saved in the database.
  const existingResponse = await fetch(url);

  if (!existingResponse.ok) {
    throw new Error("Could not load existing restaurants.");
  }

  const existingRestaurants = await existingResponse.json();

  const restaurantKey = (restaurant) =>
    JSON.stringify([
      restaurant.name.trim(),
      restaurant.address.trim(),
    ]);

  const saved = new Set(existingRestaurants.map(restaurantKey));

  for (const restaurant of restaurants) {
    const key = restaurantKey(restaurant);

    if (saved.has(key)) {
      console.log(`Skipped (already saved): ${restaurant.name}`);
      continue;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurant),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add ${restaurant.name}: ${await response.text()}`
      );
    }

    saved.add(key);
    console.log(`Added: ${restaurant.name}`);
  }
}

seedRestaurants().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});