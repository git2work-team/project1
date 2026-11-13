import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
import WantToTry from "./WantToTry";
import Review from "./Review";

import "./Navbar.css";
import { getCurrentUser, logOut } from "./auth";

function Navbar() {
  const user = getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

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
                <a href="/" onClick={handleLogOut}>
                  Log out ({user.fullName})
                </a>
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