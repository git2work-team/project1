import { describe, test, expect, beforeAll, afterEach, afterAll } from "@jest/globals";
import User from "../../tables/user.js";
import userController from "../../controllers/user-controller.js";
import { mockRes } from "../helper/mock-res.js";
import { connect, clear, close, newId } from "../helper/memory-db.js";

process.env.JWT_SECRET = "test-secret";

beforeAll(connect, 60000);
afterEach(clear);
afterAll(close);

describe("createUser", () => {
  test("creates a user", async () => {
    const req = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const user = await User.findOne({ email: "a@b.com" });
    expect(user.fullName).toBe("A");
  });

  test("does not save the plain password", async () => {
    const req = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    const res = mockRes();

    await userController.createUser(req, res);

    const user = await User.findOne({ email: "a@b.com" }).select("+passwordHash");
    expect(user.passwordHash).not.toBe("longenough");
  });

  test("rejects a short password", async () => {
    const req = { body: { fullName: "A", email: "a@b.com", password: "short" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(await User.countDocuments()).toBe(0);
  });

  test("returns 409 when the email is already used", async () => {
    const req = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    await userController.createUser(req, mockRes());
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(await User.countDocuments()).toBe(1);
  });
});

describe("loginUser", () => {
  test("logs in with the right password", async () => {
    const signup = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    await userController.createUser(signup, mockRes());
    const res = mockRes();

    await userController.loginUser({ body: { email: "a@b.com", password: "longenough" } }, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json.mock.calls[0][0].token).toBeDefined();
  });

  test("returns 401 with the wrong password", async () => {
    const signup = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    await userController.createUser(signup, mockRes());
    const res = mockRes();

    await userController.loginUser({ body: { email: "a@b.com", password: "wrongpass" } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("getUserById", () => {
  test("returns the user", async () => {
    const user = await User.create({ fullName: "A", email: "a@b.com", passwordHash: "hash" });
    const id = user._id.toString();
    const res = mockRes();

    await userController.getUserById({ params: { id }, user: { id } }, res);

    expect(res.json.mock.calls[0][0].fullName).toBe("A");
  });

  test("returns 404 when the user does not exist", async () => {
    const id = newId();
    const res = mockRes();

    await userController.getUserById({ params: { id }, user: { id } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("updateUser", () => {
  test("updates the name", async () => {
    const user = await User.create({ fullName: "A", email: "a@b.com", passwordHash: "hash" });
    const id = user._id.toString();
    const res = mockRes();

    await userController.updateUser(
      { params: { id }, user: { id }, body: { fullName: "B", email: "a@b.com" } },
      res
    );

    const updated = await User.findById(id);
    expect(updated.fullName).toBe("B");
  });

  test("returns 403 when updating someone else", async () => {
    const user = await User.create({ fullName: "A", email: "a@b.com", passwordHash: "hash" });
    const res = mockRes();

    await userController.updateUser(
      { params: { id: user._id.toString() }, user: { id: newId() }, body: { fullName: "B" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe("deleteUser", () => {
  test("deletes the user", async () => {
    const user = await User.create({ fullName: "A", email: "a@b.com", passwordHash: "hash" });
    const id = user._id.toString();
    const res = mockRes();

    await userController.deleteUser({ params: { id }, user: { id } }, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(await User.findById(id)).toBeNull();
  });
});
