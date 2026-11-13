import React from "react";
import { jest, test, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import GoogleButton from "../src/GoogleButton.jsx";

test("sets up Google with a login callback and draws the button", () => {
  const initialize = jest.fn();
  const renderButton = jest.fn();
  window.google = { accounts: { id: { initialize, renderButton } } };

  // the real pages put the button next to a main .auth-btn, whose width it copies
  render(
    <div>
      <button className="auth-btn">Sign Up</button>
      <GoogleButton onError={() => {}} />
    </div>
  );

  expect(initialize).toHaveBeenCalledWith(
    expect.objectContaining({ callback: expect.any(Function) })
  );
  expect(renderButton).toHaveBeenCalled();
});
