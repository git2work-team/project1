import { jest, describe, test, expect, afterEach } from "@jest/globals";
import MenuItem from "../tables/menu-item.js";
import Restaurant from "../tables/restaurant.js";
import menuItemController from "../controllers/menu-item-controller.js";
import { mockRes } from "./helpers/mock-res.js";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getMenuItemsByRestaurant", () => {
  test("returns 404 when the restaurant does not exist", async () => {
    jest.spyOn(Restaurant, "exists").mockResolvedValue(null);
    const req = {
      params: {
        restaurantId: "abc",
      },
    };
    const res = mockRes();

    await menuItemController.getMenuItemsByRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Restaurant not found " });
  });

  test("returns menu items sorted by name", async () => {
    const items = [{ name: "Burger" }, { name: "Fries" }];
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "abc" });
    const fakeSort = jest.fn().mockResolvedValue(items);
    jest.spyOn(MenuItem, "find").mockReturnValue({ sort: fakeSort });
    const req = {
      params: {
        restaurantId: "abc",
      },
    };
    const res = mockRes();

    await menuItemController.getMenuItemsByRestaurant(req, res);

    expect(MenuItem.find).toHaveBeenCalledWith({ restaurantId: "abc" });
    expect(fakeSort).toHaveBeenCalledWith({ name: 1 });
    expect(res.json).toHaveBeenCalledWith(items);
  });
});

describe("createMenuItem", () => {
  test("returns 404 and does not create when the restaurant does not exist", async () => {
    jest.spyOn(Restaurant, "exists").mockResolvedValue(null);
    const createSpy = jest.spyOn(MenuItem, "create");
    const req = {
      params: {
        restaurantId: "abc",
      },
      body: {
        name: "Taco",
        price: 3,
      },
    };
    const res = mockRes();

    await menuItemController.createMenuItem(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("creates the item with the restaurantId from the URL and returns 201", async () => {
    jest.spyOn(Restaurant, "exists").mockResolvedValue({ _id: "abc" });
    const created = { _id: "1", name: "Taco", price: 3, restaurantId: "abc" };
    jest.spyOn(MenuItem, "create").mockResolvedValue(created);
    const req = {
      params: {
        restaurantId: "abc",
      },
      body: {
        name: "Taco",
        price: 3,
      },
    };
    const res = mockRes();

    await menuItemController.createMenuItem(req, res);

    expect(MenuItem.create).toHaveBeenCalledWith({ name: "Taco", price: 3, restaurantId: "abc" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});

describe("updateMenuItem", () => {
  test("strips restaurantId from the body before updating", async () => {
    jest.spyOn(MenuItem, "findByIdAndUpdate").mockResolvedValue({ _id: "1", name: "fixed" });
    const req = {
      params: {
        id: "1",
      },
      body: {
        name: "fixed",
        restaurantId: "deletePls",
      },
    };
    const res = mockRes();

    await menuItemController.updateMenuItem(req, res);

    expect(MenuItem.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { name: "fixed" },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({ _id: "1", name: "fixed" });
  });

  test("returns 404 when the item does not exist", async () => {
    jest.spyOn(MenuItem, "findByIdAndUpdate").mockResolvedValue(null);
    const res = mockRes();

    await menuItemController.updateMenuItem({ params: { id: "1" }, body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Menu item not found" });
  });
});

describe("deleteMenuItem", () => {
  test("returns 204 on success", async () => {
    jest.spyOn(MenuItem, "findByIdAndDelete").mockResolvedValue({ _id: "1" });
    const res = mockRes();

    await menuItemController.deleteMenuItem({ params: { id: "1" } }, res);

    expect(MenuItem.findByIdAndDelete).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 404 when the item does not exist", async () => {
    jest.spyOn(MenuItem, "findByIdAndDelete").mockResolvedValue(null);
    const res = mockRes();

    await menuItemController.deleteMenuItem({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Menu item not found" });
  });
});
