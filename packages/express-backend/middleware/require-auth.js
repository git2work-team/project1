import jwt from "jsonwebtoken";

//run this before routes that require a valid login token
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "You need to log in" });
  }

  const token = header.slice("Bearer ".length);
  let payload;
  try {
    //check signature and expiry and throw if either is bad
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Your login expired, log in again" });
    }
    return res.status(401).json({ error: "Invalid login token" });
  }

  req.user = { id: payload.id };
  next();
}

export default requireAuth;
