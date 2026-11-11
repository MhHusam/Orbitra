import { describe, it, expect } from "vitest";
import { toE164 } from "@/lib/validation/phone";

describe("toE164", () => {
  it("normalizes a local UAE mobile", () => expect(toE164("050 123 4567", "AE")).toBe("+971501234567"));
  it("accepts international format", () => expect(toE164("+971501234567", "AE")).toBe("+971501234567"));
  it("rejects too short", () => expect(toE164("05012", "AE")).toBeNull());
  it("rejects a number from another country", () => expect(toE164("+966501234567", "AE")).toBeNull());
  it("rejects letters", () => expect(toE164("abc", "AE")).toBeNull());
});
