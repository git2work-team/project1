import React, { useState, useEffect } from "react";

import "./Navbar.css";
import { getCurrentUser, logOut, USER_CHANGED_EVENT } from "./auth";
import { getUserById } from "./api";

function Navbar() {
  const [user, setUser] = useState(getCurrentUser);
  const [isOpen, setIsOpen] = useState(false);

  // Show the new name right away when it is changed on the settings page
  useEffect(() => {
    function refreshUser() {
      setUser(getCurrentUser());
    }
    window.addEventListener(USER_CHANGED_EVENT, refreshUser);
    return () => window.removeEventListener(USER_CHANGED_EVENT, refreshUser);
  }, []);

  // Check the saved user still exists. If they were deleted, api.js logs them out.
  useEffect(() => {
    if (user) {
      getUserById(user._id).catch((error) => console.log(error.message));
    }
  }, []);

  function handleLogOut(event) {
    event.preventDefault();
    logOut();
    window.location.href = "/";
  }

  return (
    <nav className="navbar">
      <a href="/" className="site-title">
        SLOFoods
      </a>

      <ul>
        <li>
          <a href="/Browse">Browse</a>
        </li>
        <li>
          <a href="/WantToTry">Saved</a>
        </li>
        <li className="profile-dropdown">
          <button
            className="profile-trigger"
            type="button"
            aria-label="Account options"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            {/* Draw the profile icon. */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="6" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </svg>
          </button>

          {/* Only display the panel while open. */}
          {isOpen && (
            <div className="profile-panel">
              {user ? (
                <>
                  <a href="/" onClick={handleLogOut}>
                    Log out ({user.fullName})
                  </a>
                  <a href="/Settings">Settings</a>
                </>
              ) : (
                <a href="/Login">Log in</a>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;