import { describe, it, expect } from "vitest";
import { isWorkEmail, getEmailDomain } from "@/lib/validation/blocked-domains";

describe("isWorkEmail", () => {
  it("accepts a company domain", () => expect(isWorkEmail("sara@kitepay.com")).toBe(true));
  it("rejects gmail in any casing and with spaces", () => expect(isWorkEmail("  A@GMAIL.COM ")).toBe(false));
  it("rejects throwaway inboxes", () => expect(isWorkEmail("x@mailinator.com")).toBe(false));
  it("rejects text without a domain", () => expect(isWorkEmail("sara")).toBe(false));
  it("reads the part after the last @", () => expect(getEmailDomain("a@b@Kitepay.com")).toBe("kitepay.com"));
});
