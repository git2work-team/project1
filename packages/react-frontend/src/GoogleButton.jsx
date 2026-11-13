import React, { useEffect, useRef } from "react";
import { googleLogin } from "./api";
import { saveCurrentUser } from "./auth";
import { GOOGLE_CLIENT_ID } from "./config";

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";

// Google's "Sign in with Google" button. Sends the token Google gives us to our backend.
function GoogleButton({ onError }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    function showButton() {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
      });
      // Google only takes a width in pixels, so copy the width of the page's main button
      const mainButton = buttonRef.current.parentElement.querySelector(".auth-btn");
      const width = Math.min(mainButton.offsetWidth, 400);
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width,
      });
    }

    function handleCredential(response) {
      googleLogin(response.credential)
        .then((user) => {
          saveCurrentUser(user);
          window.location.href = "/";
        })
        .catch((err) => onError(err.message));
    }

    // load Google's script the first time, then draw the button
    if (window.google) {
      showButton();
    } else {
      const script = document.createElement("script");
      script.src = GOOGLE_SCRIPT;
      script.onload = showButton;
      document.body.appendChild(script);
    }
  }, [onError]);

  return <div className="auth-google" ref={buttonRef} />;
}

export default GoogleButton;
