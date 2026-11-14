import { jest, describe, test, expect, afterEach } from "@jest/globals";
import ReviewPhoto from "../../tables/review-photo.js";
import Review from "../../tables/review.js";
import reviewPhotoController from "../../controllers/review-photo-controller.js";
import { mockRes } from "../helper/mock-res.js";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getPhotosByReview", () => {
  test("returns 404 when the review does not exist", async () => {
    jest.spyOn(Review, "exists").mockResolvedValue(null);
    const req = {
      params: {
        reviewId: "rev1",
      },
    };
    const res = mockRes();

    await reviewPhotoController.getPhotosByReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
  });

  test("returns photos sorted by upload time", async () => {
    const photos = [{ imageUrl: "a.jpg" }, { imageUrl: "b.jpg" }];
    jest.spyOn(Review, "exists").mockResolvedValue({ _id: "rev1" });
    const fakeSort = jest.fn().mockResolvedValue(photos);
    jest.spyOn(ReviewPhoto, "find").mockReturnValue({ sort: fakeSort });
    const req = { params: { reviewId: "rev1" } };
    const res = mockRes();

    await reviewPhotoController.getPhotosByReview(req, res);

    expect(ReviewPhoto.find).toHaveBeenCalledWith({ reviewId: "rev1" });
    expect(fakeSort).toHaveBeenCalledWith({ uploadedAt: 1 });
    expect(res.json).toHaveBeenCalledWith(photos);
  });
});

// A fake review owned by ownerId
function fakeReview(ownerId) {
  return { _id: "rev1", userId: { equals: (id) => id === ownerId } };
}

describe("createReviewPhoto", () => {
  test("returns 404 and does not create when the review does not exist", async () => {
    jest.spyOn(Review, "findById").mockResolvedValue(null);
    const createSpy = jest.spyOn(ReviewPhoto, "create");
    const req = { params: { reviewId: "rev1" }, user: { id: "u1" }, body: { imageUrl: "a.jpg" } };
    const res = mockRes();

    await reviewPhotoController.createReviewPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("returns 403 and does not create when the review belongs to someone else", async () => {
    jest.spyOn(Review, "findById").mockResolvedValue(fakeReview("owner"));
    const createSpy = jest.spyOn(ReviewPhoto, "create");
    const req = { params: { reviewId: "rev1" }, user: { id: "u1" }, body: { imageUrl: "a.jpg" } };
    const res = mockRes();

    await reviewPhotoController.createReviewPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("creates the photo with the reviewId from the URL and returns 201", async () => {
    jest.spyOn(Review, "findById").mockResolvedValue(fakeReview("u1"));
    const created = { _id: "1", imageUrl: "a.jpg", reviewId: "rev1" };
    jest.spyOn(ReviewPhoto, "create").mockResolvedValue(created);
    const req = { params: { reviewId: "rev1" }, user: { id: "u1" }, body: { imageUrl: "a.jpg" } };
    const res = mockRes();

    await reviewPhotoController.createReviewPhoto(req, res);

    expect(ReviewPhoto.create).toHaveBeenCalledWith({ imageUrl: "a.jpg", reviewId: "rev1" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});

describe("deleteReviewPhoto", () => {
  test("returns 204 on success", async () => {
    const photo = { _id: "1", reviewId: "rev1", deleteOne: jest.fn().mockResolvedValue() };
    jest.spyOn(ReviewPhoto, "findById").mockResolvedValue(photo);
    jest.spyOn(Review, "findById").mockResolvedValue(fakeReview("u1"));
    const res = mockRes();

    await reviewPhotoController.deleteReviewPhoto({ params: { id: "1" }, user: { id: "u1" } }, res);

    expect(ReviewPhoto.findById).toHaveBeenCalledWith("1");
    expect(Review.findById).toHaveBeenCalledWith("rev1");
    expect(photo.deleteOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 403 and does not delete when the photo is on someone else's review", async () => {
    const photo = { _id: "1", reviewId: "rev1", deleteOne: jest.fn() };
    jest.spyOn(ReviewPhoto, "findById").mockResolvedValue(photo);
    jest.spyOn(Review, "findById").mockResolvedValue(fakeReview("owner"));
    const res = mockRes();

    await reviewPhotoController.deleteReviewPhoto({ params: { id: "1" }, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(photo.deleteOne).not.toHaveBeenCalled();
  });

  test("returns 404 when the photo does not exist", async () => {
    jest.spyOn(ReviewPhoto, "findById").mockResolvedValue(null);
    const res = mockRes();

    await reviewPhotoController.deleteReviewPhoto({ params: { id: "1" }, user: { id: "u1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Photo not found" });
  });
});
