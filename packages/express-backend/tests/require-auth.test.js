import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import requireAuth from "../middleware/require-auth.js";
import { mockRes } from "./helper/mock-res.js";

process.env.JWT_SECRET = "test-secret";

function reqWithHeader(authorization) {
  return { headers: authorization ? { authorization } : {} };
}

describe("requireAuth", () => {
  test("returns 401 when there is no Authorization header", () => {
    const req = reqWithHeader();
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "You need to log in" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when the header does not start with Bearer", () => {
    const req = reqWithHeader("Basic abc123");
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when the token was signed with a different secret", () => {
    const fakeToken = jwt.sign({ id: "1" }, "not-the-real-secret");
    const req = reqWithHeader(`Bearer ${fakeToken}`);
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid login token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when the token is expired", () => {
    // exp in the past
    const expiredToken = jwt.sign(
      { id: "1", exp: Math.floor(Date.now() / 1000) - 60 },
      process.env.JWT_SECRET
    );
    const req = reqWithHeader(`Bearer ${expiredToken}`);
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Your login expired, log in again" });
    expect(next).not.toHaveBeenCalled();
  });

  test("sets req.user and calls next when the token is valid", () => {
    const token = jwt.sign({ id: "user123" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const req = reqWithHeader(`Bearer ${token}`);
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(req.user).toEqual({ id: "user123" });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
