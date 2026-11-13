// One function per backend route. Names match the controller functions in express-backend.
import { API_URL } from "./config";
import { getToken, logOut } from "./auth";


// Sends a request and returns the JSON. Throws the backend's error message if it fails.
async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (res.status === 401 && token) {
    logOut();
    window.location.href = "/Login";
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // The saved user was deleted, so their old id is useless. Log out and send them to log in again.
    if (res.status === 404 && body.error === "User not found") {
      logOut();
      window.location.href = "/Login";
    }
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  // 204 (delete) has no body
  return res.status === 204 ? null : res.json();
}

// ---------- Users (user-routes.js) ----------

export function getUserById(id) {
  return request(`/users/${id}`);
}

export function createUser(user) {
  return request("/users", { method: "POST", body: JSON.stringify(user) });
}

export function loginUser(email, password) {
  return request("/users/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function googleLogin(idToken) {
  return request("/users/google", { method: "POST", body: JSON.stringify({ idToken }) });
}

// ---------- Restaurants (restaurant-routes.js) ----------

export function getRestaurants(filters = {}) {
  const queryParams = new URLSearchParams();

  if (filters.search) {
    queryParams.append("search", filters.search);
  }
  if (filters.cuisine) {
    if (Array.isArray(filters.cuisine) && filters.cuisine.length > 0) {
      queryParams.append("cuisine", filters.cuisine.join(","));
    } else if (typeof filters.cuisine === "string" && filters.cuisine.trim() !== "") {
      queryParams.append("cuisine", filters.cuisine);
    }
  }

  const queryString = queryParams.toString();
  const path = queryString ? `/restaurants?${queryString}` : "/restaurants";

  return request(path);
}

export function getCuisines() {
  return request("/restaurants/cuisines");
}


// ---------- Reviews (review-routes.js) ----------

export function getReviews(userId) {
  return request(`/reviews?userId=${userId}`);
}

export function createReview(review) {
  return request("/reviews", { method: "POST", body: JSON.stringify(review) });
}

export function deleteReview(id) {
  return request(`/reviews/${id}`, { method: "DELETE" });
}

// ---------- Saved restaurants (saved-restaurant-routes.js) ----------

export function getSavedRestaurants(userId) {
  return request(`/users/${userId}/saved-restaurants`);
}

export function saveRestaurant(userId, restaurantId) {
  return request(`/users/${userId}/saved-restaurants`, {
    method: "POST",
    body: JSON.stringify({ restaurantId }),
  });
}

export function unsaveRestaurant(userId, restaurantId) {
  return request(`/users/${userId}/saved-restaurants/${restaurantId}`, { method: "DELETE" });
}

export function getReviewsByRestaurant(restaurantId) {
  return request(`/reviews?restaurantId=${restaurantId}`);
}

//sends a photo to backend and returns upload result
//throws an error in case of failure
export async function uploadReviewPhoto(reviewId, file) {
  //asks for a signature
  const upload = await request("/photos-sign", {
    method: "POST",
  });
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", upload.api_key);
  body.append("timestamp", upload.timestamp);
  body.append("signature", upload.signature);
  body.append("folder", upload.folder);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${upload.cloud_name}/image/upload`,
    {
      method: "POST",
      body,
    }
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || "Photo upload failed");
  }
  return request(`/reviews/${reviewId}/photos`, {
    method: "POST",
    body: JSON.stringify({
      imageUrl: result.secure_url,
    }),
  });
}

export function voteReview(reviewId, userId, vote) {
  return request(`/reviews/${reviewId}/vote`, {
    method: "PUT",
    body: JSON.stringify({ userId, vote }),
  });
}
