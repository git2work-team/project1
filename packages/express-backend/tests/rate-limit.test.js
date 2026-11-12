import express from "express";
import { authLimiter } from "../middleware/rate-limit.js";

describe("authLimiter", () => {
  test("allows 10 requests then returns 429", async () => {
    const app = express();
    app.post("/login", authLimiter, (req, res) => res.json({ ok: true }));
    const server = app.listen(0);
    const url = `http://localhost:${server.address().port}/login`;

    for (let i = 0; i < 10; i++) {
      const res = await fetch(url, { method: "POST" });
      expect(res.status).toBe(200);
    }
    const blocked = await fetch(url, { method: "POST" });

    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: "Too many attempts, try again later" });
    server.close();
  });
});
