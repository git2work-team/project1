// One function per backend route. Names match the controller functions in express-backend.
import { API_URL } from "./config";

// Sends a request and returns the JSON. Throws the backend's error message if it fails.
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  // 204 (delete) has no body
  return res.status === 204 ? null : res.json();
}

// ---------- Users (user-routes.js) ----------

export function getUserById(id) {
  return request(`/users/${id}`);
}

// ---------- Restaurants (restaurant-routes.js) ----------

export function getRestaurants() {
  return request("/restaurants");
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
