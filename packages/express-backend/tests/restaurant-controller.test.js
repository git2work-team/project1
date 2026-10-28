import { jest, describe, test, expect, afterEach } from "@jest/globals";
import Restaurant from "../tables/restaurant.js";
import restaurantController from "../controllers/restaurant-controller.js";
import { mockRes } from "./helper/mock-res.js";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("createRestaurant", () => {
  test("creates the restaurant and returns 201", async () => {
    const created = { _id: "1", name: "Taco Spot", address: "1 Main St" };
    jest.spyOn(Restaurant, "create").mockResolvedValue(created);
    const req = {
      body: {
        name: "Taco Spot",
        address: "1 Main St",
      },
    };
    const res = mockRes();

    await restaurantController.createRestaurant(req, res);

    expect(Restaurant.create).toHaveBeenCalledWith({ name: "Taco Spot", address: "1 Main St" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});

describe("getRestaurants", () => {
  test("returns all restaurants with ratings, sorted by name", async () => {
    const restaurants = [
      { name: "A Place", rating: 4, reviewsNumber: 2 },
      { name: "B Place", rating: 0, reviewsNumber: 0 },
    ];
    jest.spyOn(Restaurant, "aggregate").mockResolvedValue(restaurants);
    const res = mockRes();

    await restaurantController.getRestaurants({ query: {} }, res);

    const pipeline = Restaurant.aggregate.mock.calls[0][0];
    expect(pipeline[0]).toEqual({ $match: {} });
    expect(pipeline[pipeline.length - 1]).toEqual({ $sort: { name: 1 } });
    expect(res.json).toHaveBeenCalledWith(restaurants);
  });

  test("filters by the search text", async () => {
    jest.spyOn(Restaurant, "aggregate").mockResolvedValue([]);
    const res = mockRes();

    await restaurantController.getRestaurants({ query: { search: "taco" } }, res);

    const match = Restaurant.aggregate.mock.calls[0][0][0].$match;
    expect(match.$or).toHaveLength(4);
    expect(match.$or[0].name.test("Taco Spot")).toBe(true);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe("getRestaurantById", () => {
  test("returns the restaurant when found", async () => {
    const restaurant = { _id: "1", name: "Taco Spot" };
    jest.spyOn(Restaurant, "findById").mockResolvedValue(restaurant);
    const res = mockRes();

    await restaurantController.getRestaurantById({ params: { id: "1" } }, res);

    expect(Restaurant.findById).toHaveBeenCalledWith("1");
    expect(res.json).toHaveBeenCalledWith(restaurant);
  });

  test("returns 404 when the restaurant does not exist", async () => {
    jest.spyOn(Restaurant, "findById").mockResolvedValue(null);
    const res = mockRes();

    await restaurantController.getRestaurantById({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Restaurant not found" });
  });
});

describe("updateRestaurant", () => {
  test("updates the restaurant and returns it", async () => {
    const updated = { _id: "1", name: "New Name" };
    jest.spyOn(Restaurant, "findByIdAndUpdate").mockResolvedValue(updated);
    const req = {
      params: { id: "1" },
      body: { name: "New Name" },
    };
    const res = mockRes();

    await restaurantController.updateRestaurant(req, res);

    expect(Restaurant.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { name: "New Name" },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("returns 404 when the restaurant does not exist", async () => {
    jest.spyOn(Restaurant, "findByIdAndUpdate").mockResolvedValue(null);
    const res = mockRes();

    await restaurantController.updateRestaurant({ params: { id: "1" }, body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Restaurant not found" });
  });
});

describe("deleteRestaurant", () => {
  test("returns 204 on success", async () => {
    jest.spyOn(Restaurant, "findByIdAndDelete").mockResolvedValue({ _id: "1" });
    const res = mockRes();

    await restaurantController.deleteRestaurant({ params: { id: "1" } }, res);

    expect(Restaurant.findByIdAndDelete).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 404 when the restaurant does not exist", async () => {
    jest.spyOn(Restaurant, "findByIdAndDelete").mockResolvedValue(null);
    const res = mockRes();

    await restaurantController.deleteRestaurant({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Restaurant not found" });
  });
});
