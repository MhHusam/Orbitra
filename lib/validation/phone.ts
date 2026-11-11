import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export function toE164(raw: string, country: CountryCode): string | null {
  const phone = parsePhoneNumberFromString(raw.trim(), country);
  if (!phone || !phone.isValid()) return null;
  if (phone.country !== country) return null;
  return phone.number;
}
