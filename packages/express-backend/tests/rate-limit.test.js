import express from "express";
import { authLimiter } from "../middleware/rate-limit.js";

// starts a tiny app with the limiter on /login, which responds with the given status.
// trust proxy lets each test pretend to be a different client with its own X-Forwarded-For,
// because the limiter's counts are shared by every test in this file
function startApp(status) {
  const app = express();
  app.set("trust proxy", 1);
  app.post("/login", authLimiter, (req, res) => res.status(status).json({}));
  const server = app.listen(0);
  const url = `http://localhost:${server.address().port}/login`;
  const post = (ip) => fetch(url, { method: "POST", headers: { "X-Forwarded-For": ip } });
  return { server, post };
}

describe("authLimiter", () => {
  test("allows 10 failed requests then returns 429", async () => {
    const { server, post } = startApp(401);

    for (let i = 0; i < 10; i++) {
      expect((await post("1.1.1.1")).status).toBe(401);
    }
    const blocked = await post("1.1.1.1");

    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: "Too many attempts, try again later" });
    server.close();
  });

  test("successful requests do not count toward the limit", async () => {
    const { server, post } = startApp(200);

    for (let i = 0; i < 15; i++) {
      expect((await post("3.3.3.3")).status).toBe(200);
    }
    server.close();
  });

  test("each client IP gets its own limit", async () => {
    const { server, post } = startApp(401);

    for (let i = 0; i < 10; i++) {
      await post("4.4.4.4");
    }

    expect((await post("4.4.4.4")).status).toBe(429);
    expect((await post("5.5.5.5")).status).toBe(401);
    server.close();
  });
});
