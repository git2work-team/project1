import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
import WantToTry from "./WantToTry";
import Review from "./Review";
import Navbar from "./Navbar";
import Homepage from "./Homepage";

function MyApp() {
    let Component
    switch (window.location.pathname){
            case "/":
                    Component = Homepage;
                    break;
	    
            case "/Review":
                    Component = Review;
                    break;
            case "/WantToTry":
                    Component = WantToTry;
                    break;
     }

  return (
    
	
    <div className="container">
	  
	  <Navbar />
	  <Component /> 
    </div>
   
  );
}
export default MyApp;
