import express from "express";
import helmet from "helmet";

describe("helmet", () => {
  test("adds security headers and hides X-Powered-By", async () => {
    const app = express();
    app.use(helmet());
    app.get("/", (req, res) => res.json({ ok: true }));
    const server = app.listen(0);

    const res = await fetch(`http://localhost:${server.address().port}/`);

    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-powered-by")).toBeNull();
    server.close();
  });
});
