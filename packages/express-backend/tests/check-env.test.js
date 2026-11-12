import { checkJwtSecret } from "../check-env.js";

describe("checkJwtSecret", () => {
  const original = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.JWT_SECRET = original;
  });

  test("throws when JWT_SECRET is missing", () => {
    delete process.env.JWT_SECRET;
    expect(() => checkJwtSecret()).toThrow("JWT_SECRET must be set");
  });

  test("throws when JWT_SECRET is too short", () => {
    process.env.JWT_SECRET = "short";
    expect(() => checkJwtSecret()).toThrow("at least 32 characters");
  });

  test("does not throw for a 32 character secret", () => {
    process.env.JWT_SECRET = "a".repeat(32);
    expect(() => checkJwtSecret()).not.toThrow();
  });
});
