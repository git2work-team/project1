import express from "express";
import cors from "cors";

describe("cors", () => {
  test("only allows the frontend origin", async () => {
    const app = express();
    app.use(cors({ origin: "http://localhost:5173" }));
    app.get("/", (req, res) => res.json({ ok: true }));
    const server = app.listen(0);
    const url = `http://localhost:${server.address().port}/`;

    const allowed = await fetch(url, { headers: { Origin: "http://localhost:5173" } });
    const blocked = await fetch(url, { headers: { Origin: "http://evil.com" } });

    expect(allowed.headers.get("access-control-allow-origin")).toBe("http://localhost:5173");
    expect(blocked.headers.get("access-control-allow-origin")).not.toBe("http://evil.com");
    server.close();
  });
});
