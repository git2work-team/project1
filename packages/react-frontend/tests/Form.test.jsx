import React from "react";
import { jest, test, expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Form from "../src/Form.jsx";

test("cannot post a review if a rating is not selected", () => {
  render(<Form handleSubmit={() => {}} />);

  fireEvent.change(screen.getByLabelText("Tell us about your experience"), {
    target: { value: "Good!" },
  });

  expect(screen.getByRole("button", { name: "Post Review" })).toBeDisabled();

  fireEvent.click(screen.getByRole("button", { name: "4 stars" }));

  expect(screen.getByRole("button", { name: "Post Review" })).toBeEnabled();
});

test("submit a star rating selected by user", () => {
  const handleSubmit = jest.fn();
  render(<Form handleSubmit={handleSubmit} />);

  fireEvent.click(screen.getByRole("button", { name: "4 stars" }));

  fireEvent.change(screen.getByLabelText("Tell us about your experience"), {
    target: { value: "Good!" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Post Review" }));

  expect(handleSubmit).toHaveBeenLastCalledWith({ rating: 4, description: "Good!" }, []);
});

test("adds photos and includes them in submission", () => {
  const handleSubmit = jest.fn();
  render(<Form handleSubmit={handleSubmit} />);

  const photo = new File([], "food.png", {
    type: "image.png",
  });

  fireEvent.change(screen.getByLabelText("Add photos"), {
    target: { files: [photo] },
  });

  fireEvent.click(screen.getByRole("button", { name: "2 stars" }));

  fireEvent.change(screen.getByLabelText("Tell us about your experience"), {
    target: { value: "Bad" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Post Review" }));

  expect(handleSubmit).toHaveBeenCalledWith({ rating: 2, description: "Bad" }, [photo]);
});
