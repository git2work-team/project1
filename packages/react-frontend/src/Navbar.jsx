import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
import WantToTry from "./WantToTry";
import Review from "./Review";

import "./Navbar.css";
import { getCurrentUser, logOut } from "./auth";

function Navbar() {
  const user = getCurrentUser();

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
        <li>
          {user ? (
            <a href="/" onClick={handleLogOut}>
              Log out ({user.fullName})
            </a>
          ) : (
            <a href="/Login">Log in</a>
          )}
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;
