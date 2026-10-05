import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
import WantToTry from "./WantToTry";
import Review from "./Review";

import "./Navbar.css";
function Navbar() {

  return (
    <nav className="navbar">
	  <a href="/" className="site-title">SLOFoods</a>

	  <ul>
	    <li>
	      <a href = "/Review">Review</a>
	      
	    </li>
	    <li>
	      <a href = "/WantToTry">Saved</a>
	    </li>
	      
	  </ul>

    </nav>
  );
}
export default Navbar;

