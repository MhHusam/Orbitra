import { describe, it, expect } from "vitest";
import { todayInDubai, isAllowedDemoDate, firstDemoDate, lastDemoDate } from "@/lib/validation/dates";

const TUE = new Date("2026-11-10T08:00:00Z");
const FRI_NIGHT = new Date("2026-11-13T19:30:00Z");
const LATE_UTC = new Date("2026-11-12T21:00:00Z");

describe("todayInDubai", () => {
  it("uses Dubai, not UTC", () => expect(todayInDubai(LATE_UTC)).toBe("2026-11-13"));
});

describe("demo date window", () => {
  it("first day is the next working day", () => expect(firstDemoDate(TUE)).toBe("2026-11-11"));
  it("last day is 30 days ahead", () => expect(lastDemoDate(TUE)).toBe("2026-12-10"));
  it("Friday night → Monday", () => expect(firstDemoDate(FRI_NIGHT)).toBe("2026-11-16"));
});

describe("isAllowedDemoDate", () => {
  it("rejects today", () => expect(isAllowedDemoDate("2026-11-10", TUE)).toBe(false));
  it("accepts the next working day", () => expect(isAllowedDemoDate("2026-11-11", TUE)).toBe(true));
  it("rejects Saturday", () => expect(isAllowedDemoDate("2026-11-14", TUE)).toBe(false));
  it("rejects Sunday", () => expect(isAllowedDemoDate("2026-11-15", TUE)).toBe(false));
  it("accepts 30 days ahead if a weekday", () => expect(isAllowedDemoDate("2026-12-10", TUE)).toBe(true));
  it("rejects 31 days ahead", () => expect(isAllowedDemoDate("2026-12-11", TUE)).toBe(false));
  it("rejects bad format", () => expect(isAllowedDemoDate("10/11/2026", TUE)).toBe(false));
  it("rejects impossible date", () => expect(isAllowedDemoDate("2026-02-30", TUE)).toBe(false));
});
