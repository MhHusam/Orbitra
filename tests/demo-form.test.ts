import { describe, expect, it } from "vitest";
import { EMPTY, firstError, isVisible, stepOf, validateStep } from "@/lib/demo-form";

const step1 = { ...EMPTY, firstName: "Sara", lastName: "Haddad", email: "sara@kitepay.com", contactMethod: "email" };

describe("demo form steps", () => {
  it("empty step 1 → errors in screen order, first is firstName", () => {
    const errors = validateStep(0, EMPTY);
    expect(firstError(0, errors)).toBe("firstName");
    expect(errors.email).toBeDefined();
    expect(errors.contactMethod).toBe("Choose how we should contact you");
  });
  it("email contact → phone hidden and not required", () => {
    expect(isVisible("phone", step1)).toBe(false);
    expect(validateStep(0, step1)).toEqual({});
  });
  it("whatsapp → phone required and checked for the country", () => {
    const v = { ...step1, contactMethod: "whatsapp", phone: "123" };
    expect(validateStep(0, v).phone).toBe("Enter a valid number for the selected country");
    expect(validateStep(0, { ...v, phone: "050 123 4567" })).toEqual({});
  });
  it("step 3 only reports its own fields and needs budget for 51+", () => {
    const errors = validateStep(2, { ...EMPTY, companySize: "51-200" });
    expect(Object.keys(errors)).not.toContain("companySize");
    expect(errors.interests).toBeDefined();
  });
  it("maps server field names back to their step", () => {
    expect(stepOf("email")).toBe(0);
    expect(stepOf("website")).toBe(1);
    expect(stepOf("demoDate")).toBe(2);
  });
});
