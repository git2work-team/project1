import { test, expect } from "@jest/globals";
import { isOpenNow } from "../src/openNow.js";

// Mon-Fri 9am to 5pm
const weekdays = [1, 2, 3, 4, 5].map((day) => ({
  open: { day, hour: 9, minute: 0 },
  close: { day, hour: 17, minute: 0 },
}));

// Saturday 8pm to Sunday 2am (crosses midnight and the end of the week)
const lateNight = [
  { open: { day: 6, hour: 20, minute: 0 }, close: { day: 0, hour: 2, minute: 0 } },
];

// Times are written with the San Luis Obispo offset (-08:00 in November)
test("open in the middle of a weekday", () => {
  expect(isOpenNow(weekdays, new Date("2026-11-16T12:00:00-08:00"))).toBe(true);
});

test("closed right at closing time", () => {
  expect(isOpenNow(weekdays, new Date("2026-11-16T17:00:00-08:00"))).toBe(false);
});

test("closed on a day with no hours", () => {
  expect(isOpenNow(weekdays, new Date("2026-11-15T12:00:00-08:00"))).toBe(false);
});

test("open late Saturday and after midnight into Sunday", () => {
  expect(isOpenNow(lateNight, new Date("2026-11-14T23:00:00-08:00"))).toBe(true);
  expect(isOpenNow(lateNight, new Date("2026-11-15T01:30:00-08:00"))).toBe(true);
  expect(isOpenNow(lateNight, new Date("2026-11-15T03:00:00-08:00"))).toBe(false);
});

test("a period with no close means open 24/7", () => {
  expect(isOpenNow([{ open: { day: 0, hour: 0, minute: 0 } }])).toBe(true);
});

test("returns null when there are no hours", () => {
  expect(isOpenNow(undefined)).toBe(null);
  expect(isOpenNow([])).toBe(null);
});
