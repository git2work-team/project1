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

// A fake review from the database, owned by ownerId
function fakeReview(ownerId) {
  return {
    _id: "rev1",
    userId: { equals: (id) => id === ownerId },
    rating: 3,
    description: "Old",
    save: jest.fn().mockResolvedValue(),
    deleteOne: jest.fn().mockResolvedValue(),
  };
}

describe("getReviews", () => {
  test("filters by restaurantId and userId from the query string", async () => {
    const reviews = [{ _id: "rev1", toJSON: () => ({ _id: "rev1", title: "Great" }) }];
    const fakeSort = jest.fn().mockResolvedValue(reviews);
    const fakePopulate2 = jest.fn().mockReturnValue({ sort: fakeSort });
    const fakePopulate1 = jest.fn().mockReturnValue({ populate: fakePopulate2 });
    jest.spyOn(Review, "find").mockReturnValue({ populate: fakePopulate1 });
    // getReviews also loads each review's photos
    const fakePhotoSort = jest.fn().mockResolvedValue([{ url: "photo.jpg" }]);
    jest.spyOn(ReviewPhoto, "find").mockReturnValue({ sort: fakePhotoSort });
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
    expect(ReviewPhoto.find).toHaveBeenCalledWith({ reviewId: "rev1" });
    expect(res.json).toHaveBeenCalledWith([
      { _id: "rev1", title: "Great", photos: [{ url: "photo.jpg" }] },
    ]);
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
    description: "Loved it",
  };

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(Review, "create");
    const res = mockRes();

    await reviewController.createReview({ body, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("returns 404 when the restaurant does not exist", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(Review, "create");
    const res = mockRes();

    await reviewController.createReview({ body, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Restaurant not found" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("creates the review with only the allowed fields and returns 201", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "r1" });
    jest.spyOn(Review, "exists").mockResolvedValue(null);
    const created = { _id: "rev1", ...body };
    jest.spyOn(Review, "create").mockResolvedValue(created);
    const res = mockRes();

    await reviewController.createReview(
      { body: { ...body, extra: "ignored" }, user: { id: "u1" } },
      res
    );

    expect(Review.create).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test("returns 409 when the user already reviewed the restaurant", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "r1" });
    jest.spyOn(Review, "exists").mockResolvedValue({ _id: "rev1" });
    const createSpy = jest.spyOn(Review, "create");
    const res = mockRes();

    await reviewController.createReview({ body, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "You already reviewed this restaurant" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("returns 409 when the database rejects a duplicate review", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "r1" });
    // Both requests pass the exists check, then the unique index blocks the second one
    jest.spyOn(Review, "exists").mockResolvedValue(null);
    jest.spyOn(Review, "create").mockRejectedValue({ code: 11000 });
    const res = mockRes();

    await reviewController.createReview({ body, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "You already reviewed this restaurant" });
  });

  test("uses the logged-in user, not a userId sent in the body", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "r1" });
    jest.spyOn(Review, "exists").mockResolvedValue(null);
    jest.spyOn(Review, "create").mockResolvedValue({ _id: "rev1" });
    const res = mockRes();

    await reviewController.createReview(
      { body: { ...body, userId: "someoneElse" }, user: { id: "u1" } },
      res
    );

    expect(Review.create).toHaveBeenCalledWith(expect.objectContaining({ userId: "u1" }));
  });
});

describe("updateReview", () => {
  test("only changes rating and description, ignoring other fields", async () => {
    const review = fakeReview("u1");
    const originalUserId = review.userId;
    jest.spyOn(Review, "findById").mockResolvedValue(review);
    const req = {
      params: { id: "rev1" },
      user: { id: "u1" },
      body: { rating: 5, description: "New", userId: "other", restaurantId: "other" },
    };
    const res = mockRes();

    await reviewController.updateReview(req, res);

    expect(review.rating).toBe(5);
    expect(review.description).toBe("New");
    expect(review.userId).toBe(originalUserId);
    expect(review.restaurantId).toBeUndefined();
    expect(review.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(review);
  });

  test("returns 403 and does not save when the review belongs to someone else", async () => {
    const review = fakeReview("owner");
    jest.spyOn(Review, "findById").mockResolvedValue(review);
    const req = { params: { id: "rev1" }, user: { id: "u1" }, body: { rating: 1 } };
    const res = mockRes();

    await reviewController.updateReview(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(review.save).not.toHaveBeenCalled();
    expect(review.rating).toBe(3);
  });

  test("returns 404 when the review does not exist", async () => {
    jest.spyOn(Review, "findById").mockResolvedValue(null);
    const res = mockRes();

    await reviewController.updateReview(
      { params: { id: "rev1" }, user: { id: "u1" }, body: {} },
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
  });
});

describe("deleteReview", () => {
  test("deletes the review and its photos", async () => {
    const review = fakeReview("u1");
    jest.spyOn(Review, "findById").mockResolvedValue(review);
    jest.spyOn(ReviewPhoto, "deleteMany").mockResolvedValue({ deletedCount: 2 });
    const res = mockRes();

    await reviewController.deleteReview({ params: { id: "rev1" }, user: { id: "u1" } }, res);

    expect(Review.findById).toHaveBeenCalledWith("rev1");
    expect(review.deleteOne).toHaveBeenCalled();
    expect(ReviewPhoto.deleteMany).toHaveBeenCalledWith({ reviewId: "rev1" });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 403 and deletes nothing when the review belongs to someone else", async () => {
    const review = fakeReview("owner");
    jest.spyOn(Review, "findById").mockResolvedValue(review);
    const deleteManySpy = jest.spyOn(ReviewPhoto, "deleteMany");
    const res = mockRes();

    await reviewController.deleteReview({ params: { id: "rev1" }, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(review.deleteOne).not.toHaveBeenCalled();
    expect(deleteManySpy).not.toHaveBeenCalled();
  });

  test("returns 404 and deletes no photos when the review does not exist", async () => {
    jest.spyOn(Review, "findById").mockResolvedValue(null);
    const deleteManySpy = jest.spyOn(ReviewPhoto, "deleteMany");
    const res = mockRes();

    await reviewController.deleteReview({ params: { id: "rev1" }, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
    expect(deleteManySpy).not.toHaveBeenCalled();
  });
});
