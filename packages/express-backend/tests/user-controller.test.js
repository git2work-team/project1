import { jest, describe, test, expect, afterEach } from "@jest/globals";
import bcrypt from "bcryptjs";
import User from "../tables/user.js";
import userController from "../controllers/user-controller.js";
import { mockRes } from "./helper/mock-res.js";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("createUser", () => {
  test("rejects passwords shorter than 8 characters", async () => {
    const createSpy = jest.spyOn(User, "create");
    const req = { body: { fullName: "A", email: "a@b.com", password: "short" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Password must be at least 8 characters" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("rejects a missing password", async () => {
    const createSpy = jest.spyOn(User, "create");
    const req = { body: { fullName: "A", email: "a@b.com" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("hashes the password and never stores it in plain text", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed!");
    jest.spyOn(User, "create").mockResolvedValue({ _id: "1", fullName: "A" });
    const req = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("longenough", 10);
    expect(User.create).toHaveBeenCalledWith({
      fullName: "A",
      email: "a@b.com",
      passwordHash: "hashed!",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: "1", fullName: "A" });
  });
});

describe("getUserById", () => {
  test("returns the user when found", async () => {
    const user = { _id: "1", fullName: "A" };
    jest.spyOn(User, "findById").mockResolvedValue(user);
    const res = mockRes();

    await userController.getUserById({ params: { id: "1" } }, res);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "findById").mockResolvedValue(null);
    const res = mockRes();

    await userController.getUserById({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

describe("updateUser", () => {
  test("only updates fullName and email, ignoring other fields", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "1", fullName: "B" });
    const req = {
      params: { id: "1" },
      body: { fullName: "B", email: "b@b.com", passwordHash: "sneaky" },
    };
    const res = mockRes();

    await userController.updateUser(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { fullName: "B", email: "b@b.com" },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({ _id: "1", fullName: "B" });
  });

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue(null);
    const res = mockRes();

    await userController.updateUser({ params: { id: "1" }, body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteUser", () => {
  test("returns 204 on success", async () => {
    jest.spyOn(User, "findByIdAndDelete").mockResolvedValue({ _id: "1" });
    const res = mockRes();

    await userController.deleteUser({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "findByIdAndDelete").mockResolvedValue(null);
    const res = mockRes();

    await userController.deleteUser({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
