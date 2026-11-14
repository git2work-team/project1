import { jest, describe, test, expect, afterEach } from "@jest/globals";
import User from "../../tables/user.js";
import googleAuth from "../../google-auth.js";
import userController from "../../controllers/user-controller.js";
import { mockRes } from "../helper/mock-res.js";

process.env.JWT_SECRET = "test-secret";

afterEach(() => {
  jest.restoreAllMocks();
});

// what Google sends back for a valid account
const googleAccount = {
  sub: "google-123",
  email: "Student@gmail.com",
  name: "Student",
  email_verified: true,
};

describe("googleLogin", () => {
  test("returns 400 when the token is missing or not a string", async () => {
    const verifySpy = jest.spyOn(googleAuth, "verifyGoogleToken");
    const res = mockRes();

    await userController.googleLogin({ body: { idToken: { $ne: "" } } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(verifySpy).not.toHaveBeenCalled();
  });

  test("returns 401 when Google rejects the token", async () => {
    jest.spyOn(googleAuth, "verifyGoogleToken").mockRejectedValue(new Error("bad token"));
    const res = mockRes();

    await userController.googleLogin({ body: { idToken: "fake" } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Google login" });
  });

  test("returns 403 when Google says the email is not verified", async () => {
    jest
      .spyOn(googleAuth, "verifyGoogleToken")
      .mockResolvedValue({ ...googleAccount, email_verified: false });
    const res = mockRes();

    await userController.googleLogin({ body: { idToken: "t" } }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Your Google email is not verified" });
  });

  test("creates a new account the first time", async () => {
    jest.spyOn(googleAuth, "verifyGoogleToken").mockResolvedValue(googleAccount);
    jest.spyOn(User, "findOne").mockResolvedValue(null);
    const createSpy = jest.spyOn(User, "create").mockResolvedValue({ _id: "1", fullName: "Student" });
    const res = mockRes();

    await userController.googleLogin({ body: { idToken: "t" } }, res);

    expect(createSpy).toHaveBeenCalledWith({
      fullName: "Student",
      email: "Student@gmail.com",
      googleId: "google-123",
    });
    expect(res.json).toHaveBeenCalledWith({
      token: expect.any(String),
      user: { _id: "1", fullName: "Student" },
    });
  });

  test("links Google to an existing password account and removes its password", async () => {
    jest.spyOn(googleAuth, "verifyGoogleToken").mockResolvedValue(googleAccount);
    const existing = { _id: "1", fullName: "Student", passwordHash: "old-hash", save: jest.fn() };
    const findSpy = jest.spyOn(User, "findOne").mockResolvedValue(existing);
    const createSpy = jest.spyOn(User, "create");
    const res = mockRes();

    await userController.googleLogin({ body: { idToken: "t" } }, res);

    expect(findSpy).toHaveBeenCalledWith({ email: "student@gmail.com" });
    expect(existing.googleId).toBe("google-123");
    // the old password is removed so it cannot be used to get into the account
    expect(existing.passwordHash).toBeUndefined();
    expect(existing.save).toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String), user: existing });
  });

  test("a returning Google user is logged in without saving again", async () => {
    jest.spyOn(googleAuth, "verifyGoogleToken").mockResolvedValue(googleAccount);
    const existing = { _id: "1", googleId: "google-123", save: jest.fn() };
    jest.spyOn(User, "findOne").mockResolvedValue(existing);
    const res = mockRes();

    await userController.googleLogin({ body: { idToken: "t" } }, res);

    expect(existing.save).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String), user: existing });
  });
});

describe("loginUser with a Google-only account", () => {
  test("returns 401 instead of crashing when there is no password", async () => {
    const googleOnlyUser = { _id: "1", fullName: "Student" };
    const select = jest.fn().mockResolvedValue(googleOnlyUser);
    jest.spyOn(User, "findOne").mockReturnValue({ select });
    const res = mockRes();

    await userController.loginUser({ body: { email: "s@gmail.com", password: "whatever1" } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Incorrect email or password" });
  });
});
