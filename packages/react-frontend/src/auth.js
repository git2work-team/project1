// Remembers who is logged in, in the browser's localStorage, so it stays after a refresh.
// Only the id, name, and email are kept, never the password.
const KEY = "sloFoodsUser";

export function saveCurrentUser(user) {
  const info = { _id: user._id, fullName: user.fullName, email: user.email };
  try {
    localStorage.setItem(KEY, JSON.stringify(info));
  } catch (error) {
    console.log("Could not save login:", error);
  }
}

export function getCurrentUser() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function logOut() {
  try {
    localStorage.removeItem(KEY);
  } catch (error) {
    console.log("Could not log out:", error);
  }
}
