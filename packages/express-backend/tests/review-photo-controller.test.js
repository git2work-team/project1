import { jest, describe, test, expect, afterEach } from "@jest/globals";
import ReviewPhoto from "../tables/review-photo.js";
import Review from "../tables/review.js";
import reviewPhotoController from "../controllers/review-photo-controller.js";
import { mockRes } from "./helper/mock-res.js";

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

describe("createReviewPhoto", () => {
  test("returns 404 and does not create when the review does not exist", async () => {
    jest.spyOn(Review, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(ReviewPhoto, "create");
    const req = { params: { reviewId: "rev1" }, body: { imageUrl: "a.jpg" } };
    const res = mockRes();

    await reviewPhotoController.createReviewPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("creates the photo with the reviewId from the URL and returns 201", async () => {
    jest.spyOn(Review, "exists").mockResolvedValue({ _id: "rev1" });
    const created = { _id: "1", imageUrl: "a.jpg", reviewId: "rev1" };
    jest.spyOn(ReviewPhoto, "create").mockResolvedValue(created);
    const req = { params: { reviewId: "rev1" }, body: { imageUrl: "a.jpg" } };
    const res = mockRes();

    await reviewPhotoController.createReviewPhoto(req, res);

    expect(ReviewPhoto.create).toHaveBeenCalledWith({ imageUrl: "a.jpg", reviewId: "rev1" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});

describe("deleteReviewPhoto", () => {
  test("returns 204 on success", async () => {
    jest.spyOn(ReviewPhoto, "findByIdAndDelete").mockResolvedValue({ _id: "1" });
    const res = mockRes();

    await reviewPhotoController.deleteReviewPhoto({ params: { id: "1" } }, res);

    expect(ReviewPhoto.findByIdAndDelete).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 404 when the photo does not exist", async () => {
    jest.spyOn(ReviewPhoto, "findByIdAndDelete").mockResolvedValue(null);
    const res = mockRes();

    await reviewPhotoController.deleteReviewPhoto({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Photo not found" });
  });
});
