import React from "react";
import { jest, test, expect, beforeEach, afterEach } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Settings from "../src/Settings.jsx";
import { saveCurrentUser, getCurrentUser } from "../src/auth.js";

// What the backend sends back for GET /users/1
const savedUser = {
  _id: "1",
  fullName: "Ann",
  email: "ann@example.com",
  bio: "Loves tacos",
  allergies: ["peanuts", "shellfish"],
  dislikedFoods: ["pork"],
};

// A fake fetch response with just what api.js uses
function reply(body, status = 200) {
  return { ok: status < 400, status, json: async () => body };
}

beforeEach(() => {
  localStorage.clear();
  saveCurrentUser({
    token: "test-token",
    user: { _id: "1", fullName: "Ann", email: "ann@example.com" },
  });
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("fills the form with the saved profile", async () => {
  globalThis.fetch.mockResolvedValueOnce(reply(savedUser));
  render(<Settings />);

  expect(await screen.findByLabelText("Name")).toHaveValue("Ann");
  expect(screen.getByLabelText("Bio")).toHaveValue("Loves tacos");
  expect(screen.getByLabelText("Allergies")).toHaveValue("peanuts, shellfish");
  expect(screen.getByLabelText("Foods I don't eat")).toHaveValue("pork");
});

test("saves the changes, turns the text into lists and does not send the email", async () => {
  globalThis.fetch
    .mockResolvedValueOnce(reply(savedUser))
    .mockResolvedValueOnce(reply({ ...savedUser, fullName: "Ann B", allergies: ["peanuts"] }));
  render(<Settings />);

  fireEvent.change(await screen.findByLabelText("Name"), { target: { value: " Ann B " } });
  fireEvent.change(screen.getByLabelText("Allergies"), { target: { value: "peanuts, , " } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByText("Saved")).toBeInTheDocument();

  const [url, options] = globalThis.fetch.mock.calls[1];
  expect(url).toMatch(/\/users\/1$/);
  expect(options.method).toBe("PATCH");
  expect(options.headers.Authorization).toBe("Bearer test-token");
  expect(JSON.parse(options.body)).toEqual({
    fullName: "Ann B",
    bio: "Loves tacos",
    allergies: ["peanuts"],
    dislikedFoods: ["pork"],
  });
  // the navbar reads this, and the private details are not kept in the browser
  expect(getCurrentUser().fullName).toBe("Ann B");
  expect(getCurrentUser().bio).toBeUndefined();
});

test("tells the navbar when the name changes", async () => {
  const heard = jest.fn();
  window.addEventListener("sloFoodsUserChanged", heard);
  globalThis.fetch
    .mockResolvedValueOnce(reply(savedUser))
    .mockResolvedValueOnce(reply({ ...savedUser, fullName: "Ann B" }));
  render(<Settings />);

  fireEvent.change(await screen.findByLabelText("Name"), { target: { value: "Ann B" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await screen.findByText("Saved");

  expect(heard).toHaveBeenCalled();
  window.removeEventListener("sloFoodsUserChanged", heard);
});

test("shows the backend's error when saving fails", async () => {
  globalThis.fetch
    .mockResolvedValueOnce(reply(savedUser))
    .mockResolvedValueOnce(reply({ error: "Something went wrong" }, 400));
  render(<Settings />);

  await screen.findByLabelText("Name");
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  expect(screen.queryByText("Saved")).not.toBeInTheDocument();
});

test("does not save a blank name", async () => {
  globalThis.fetch.mockResolvedValueOnce(reply(savedUser));
  render(<Settings />);

  fireEvent.change(await screen.findByLabelText("Name"), { target: { value: "   " } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByText("Enter your name")).toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
});

test("does not save more than 20 allergies", async () => {
  globalThis.fetch.mockResolvedValueOnce(reply(savedUser));
  render(<Settings />);

  const tooMany = Array.from({ length: 21 }, (_, i) => `food${i}`).join(", ");
  fireEvent.change(await screen.findByLabelText("Allergies"), { target: { value: tooMany } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByText(/at most 20 items/)).toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
});

test("hides the form if the profile could not be loaded, so blanks can't be saved over it", async () => {
  globalThis.fetch.mockResolvedValueOnce(reply({ error: "Server is down" }, 500));
  render(<Settings />);

  expect(await screen.findByText(/Server is down/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
});

test("shows nothing and does not call the backend when logged out", () => {
  localStorage.clear();
  // jsdom can't really change pages, so silence its "not implemented" message
  jest.spyOn(console, "error").mockImplementation(() => {});
  const { container } = render(<Settings />);

  expect(container).toBeEmptyDOMElement();
  expect(globalThis.fetch).not.toHaveBeenCalled();
});
