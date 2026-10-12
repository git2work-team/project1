import { jest, describe, test, expect, afterEach } from "@jest/globals";
import SavedRestaurant from "../tables/saved-restaurant.js";
import Restaurant from "../tables/restaurant.js";
import User from "../tables/user.js";
import savedRestaurantController from "../controllers/saved-restaurant-controller.js";
import { mockRes } from "./helper/mock-res.js";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getSavedRestaurants", () => {
  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "exists").mockResolvedValue(null);
    const req = {
      params: {
        userId: "u1",
      },
    };
    const res = mockRes();

    await savedRestaurantController.getSavedRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  test("returns saved restaurants with restaurant details, newest first", async () => {
    const saved = [{ restaurantId: { name: "Taco Spot" } }];
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    const fakeSort = jest.fn().mockResolvedValue(saved);
    const fakePopulate = jest.fn().mockReturnValue({ sort: fakeSort });
    jest.spyOn(SavedRestaurant, "find").mockReturnValue({ populate: fakePopulate });
    const req = { params: { userId: "u1" } };
    const res = mockRes();

    await savedRestaurantController.getSavedRestaurants(req, res);

    expect(SavedRestaurant.find).toHaveBeenCalledWith({ userId: "u1" });
    expect(fakePopulate).toHaveBeenCalledWith("restaurantId");
    expect(fakeSort).toHaveBeenCalledWith({ savedAt: -1 });
    expect(res.json).toHaveBeenCalledWith(saved);
  });
});

describe("saveRestaurant", () => {
  test("returns 404 and does not save when the user does not exist", async () => {
    jest.spyOn(User, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(SavedRestaurant, "create");
    const req = { params: { userId: "u1" }, body: { restaurantId: "r1" } };
    const res = mockRes();

    await savedRestaurantController.saveRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("returns 404 and does not save when the restaurant does not exist", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(SavedRestaurant, "create");
    const req = { params: { userId: "u1" }, body: { restaurantId: "r1" } };
    const res = mockRes();

    await savedRestaurantController.saveRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Restaurant not found" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("saves the restaurant for the user and returns 201", async () => {
    jest.spyOn(User, "exists").mockResolvedValue({ _id: "u1" });
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "r1" });
    const created = { _id: "1", userId: "u1", restaurantId: "r1" };
    jest.spyOn(SavedRestaurant, "create").mockResolvedValue(created);
    const req = { params: { userId: "u1" }, body: { restaurantId: "r1" } };
    const res = mockRes();

    await savedRestaurantController.saveRestaurant(req, res);

    expect(SavedRestaurant.create).toHaveBeenCalledWith({ userId: "u1", restaurantId: "r1" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});

describe("unsaveRestaurant", () => {
  test("returns 204 on success", async () => {
    jest.spyOn(SavedRestaurant, "findOneAndDelete").mockResolvedValue({ _id: "1" });
    const req = { params: { userId: "u1", restaurantId: "r1" } };
    const res = mockRes();

    await savedRestaurantController.unsaveRestaurant(req, res);

    expect(SavedRestaurant.findOneAndDelete).toHaveBeenCalledWith({
      userId: "u1",
      restaurantId: "r1",
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 404 when the restaurant was not saved", async () => {
    jest.spyOn(SavedRestaurant, "findOneAndDelete").mockResolvedValue(null);
    const req = { params: { userId: "u1", restaurantId: "r1" } };
    const res = mockRes();

    await savedRestaurantController.unsaveRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Saved restaurant not found" });
  });
});
