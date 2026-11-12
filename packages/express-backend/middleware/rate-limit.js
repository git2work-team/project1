import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

// strict limit for login and signup so passwords can't be guessed quickly
export const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  message: { error: "Too many attempts, try again later" },
});

// looser limit for every other route
export const generalLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 200,
  message: { error: "Too many requests, try again later" },
});
