import { jest, describe, test, expect, afterEach } from "@jest/globals";
import Review from "../tables/review.js";
import ReviewPhoto from "../tables/review-photo.js";
import Restaurant from "../tables/restaurant.js";
import User from "../tables/user.js";
import reviewController from "../controllers/review-controller.js";
import { mockRes } from "./helper/mock-res.js";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getReviews", () => {
  test("filters by restaurantId and userId from the query string", async () => {
    const reviews = [{ title: "Great" }];
    const fakeSort = jest.fn().mockResolvedValue(reviews);
    const fakePopulate2 = jest.fn().mockReturnValue({ sort: fakeSort });
    const fakePopulate1 = jest.fn().mockReturnValue({ populate: fakePopulate2 });
    jest.spyOn(Review, "find").mockReturnValue({ populate: fakePopulate1 });
    const req = {
      query: {
        restaurantId: "r1",
        userId: "u1",
      },
    };
    const res = mockRes();

    await reviewController.getReviews(req, res);

    expect(Review.find).toHaveBeenCalledWith({ restaurantId: "r1", userId: "u1" });
    expect(fakePopulate1).toHaveBeenCalledWith("userId", "fullName");
    expect(fakePopulate2).toHaveBeenCalledWith("restaurantId", "name");
    expect(fakeSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.json).toHaveBeenCalledWith(reviews);
  });

  test("uses an empty filter when no query params are given", async () => {
    const fakeSort = jest.fn().mockResolvedValue([]);
    const fakePopulate2 = jest.fn().mockReturnValue({ sort: fakeSort });
    const fakePopulate1 = jest.fn().mockReturnValue({ populate: fakePopulate2 });
    jest.spyOn(Review, "find").mockReturnValue({ populate: fakePopulate1 });
    const res = mockRes();

    await reviewController.getReviews({ query: {} }, res);

    expect(Review.find).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe("getReviewById", () => {
  test("returns the review with its photos attached", async () => {
    const fakeReview = {
      _id: "rev1",
      toJSON: () => ({ _id: "rev1", title: "Great" }),
    };
    const fakePopulate2 = jest.fn().mockResolvedValue(fakeReview);
    const fakePopulate1 = jest.fn().mockReturnValue({ populate: fakePopulate2 });
    jest.spyOn(Review, "findById").mockReturnValue({ populate: fakePopulate1 });

    const photos = [{ imageUrl: "a.jpg" }];
    const fakePhotoSort = jest.fn().mockResolvedValue(photos);
    jest.spyOn(ReviewPhoto, "find").mockReturnValue({ sort: fakePhotoSort });
    const res = mockRes();

    await reviewController.getReviewById({ params: { id: "rev1" } }, res);

    expect(Review.findById).toHaveBeenCalledWith("rev1");
    expect(ReviewPhoto.find).toHaveBeenCalledWith({ reviewId: "rev1" });
    expect(fakePhotoSort).toHaveBeenCalledWith({ uploadedAt: 1 });
    expect(res.json).toHaveBeenCalledWith({ _id: "rev1", title: "Great", photos });
  });

  test("returns 404 and skips the photo lookup when the review does not exist", async () => {
    const fakePopulate2 = jest.fn().mockResolvedValue(null);
    const fakePopulate1 = jest.fn().mockReturnValue({ populate: fakePopulate2 });
    jest.spyOn(Review, "findById").mockReturnValue({ populate: fakePopulate1 });
    const photoSpy = jest.spyOn(ReviewPhoto, "find");
    const res = mockRes();

    await reviewController.getReviewById({ params: { id: "rev1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
    expect(photoSpy).not.toHaveBeenCalled();
  });
});

describe("createReview", () => {
  const body = {
    userId: "u1",
    restaurantId: "r1",
    rating: 4.5,
    timeVisited: "Lunch",
    whatIGot: "Tacos",
    title: "Great",
    description: "Loved it",
  };

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(Review, "create");
    const res = mockRes();

    await reviewController.createReview({ body }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("returns 404 when the restaurant does not exist", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(Review, "create");
    const res = mockRes();

    await reviewController.createReview({ body }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Restaurant not found" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("creates the review with only the allowed fields and returns 201", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "r1" });
    const created = { _id: "rev1", ...body };
    jest.spyOn(Review, "create").mockResolvedValue(created);
    const res = mockRes();

    await reviewController.createReview({ body: { ...body, extra: "ignored" } }, res);

    expect(Review.create).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});

describe("updateReview", () => {
  test("strips userId and restaurantId before updating", async () => {
    jest.spyOn(Review, "findByIdAndUpdate").mockResolvedValue({ _id: "rev1", title: "New" });
    const req = {
      params: { id: "rev1" },
      body: { title: "New", userId: "other", restaurantId: "other" },
    };
    const res = mockRes();

    await reviewController.updateReview(req, res);

    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
      "rev1",
      { title: "New" },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({ _id: "rev1", title: "New" });
  });

  test("returns 404 when the review does not exist", async () => {
    jest.spyOn(Review, "findByIdAndUpdate").mockResolvedValue(null);
    const res = mockRes();

    await reviewController.updateReview({ params: { id: "rev1" }, body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
  });
});

describe("deleteReview", () => {
  test("deletes the review and its photos", async () => {
    jest.spyOn(Review, "findByIdAndDelete").mockResolvedValue({ _id: "rev1" });
    jest.spyOn(ReviewPhoto, "deleteMany").mockResolvedValue({ deletedCount: 2 });
    const res = mockRes();

    await reviewController.deleteReview({ params: { id: "rev1" } }, res);

    expect(Review.findByIdAndDelete).toHaveBeenCalledWith("rev1");
    expect(ReviewPhoto.deleteMany).toHaveBeenCalledWith({ reviewId: "rev1" });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 404 and deletes no photos when the review does not exist", async () => {
    jest.spyOn(Review, "findByIdAndDelete").mockResolvedValue(null);
    const deleteManySpy = jest.spyOn(ReviewPhoto, "deleteMany");
    const res = mockRes();

    await reviewController.deleteReview({ params: { id: "rev1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
    expect(deleteManySpy).not.toHaveBeenCalled();
  });
});
