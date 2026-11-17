// Uses the deployed backend when the site is built for Azure (VITE_API_URL is set in .env.production),
// and the local backend when running npm run dev on our laptops
export const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
export const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
