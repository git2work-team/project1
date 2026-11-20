// Remembers who is logged in, in the browser's localStorage, so it stays after a refresh.
// Only the id, name, email, and profile photo are kept, never the password. Private details
// like the bio and allergies stay on the server and are only loaded on the settings page.
const TOKEN_KEY = "sloFoodsToken";
const KEY = "sloFoodsUser";
// Sent on window when the saved user changes, so the navbar can show the new name and photo
export const USER_CHANGED_EVENT = "sloFoodsUserChanged";

export function saveCurrentUser({ token, user }) {
  const info = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageUrl: user.profileImageUrl || null,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(info));
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.log("Could not save login:", error);
  }
}

// Updates the saved user after they edit their profile. Only the fields kept in
// localStorage are copied, so nothing private is stored by accident.
export function updateCurrentUser(changes) {
  const current = getCurrentUser();
  if (!current) {
    return;
  }
  const next = { ...current };
  for (const field of ["fullName", "email", "profileImageUrl"]) {
    if (changes[field] !== undefined) {
      next[field] = changes[field];
    }
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (error) {
    console.log("Could not save profile:", error);
  }
  window.dispatchEvent(new Event(USER_CHANGED_EVENT));
}

export function getCurrentUser() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function logOut() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.log("Could not log out:", error);
  }
}
