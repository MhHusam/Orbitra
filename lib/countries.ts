import { getCountries, getCountryCallingCode } from "libphonenumber-js/max";

const names = new Intl.DisplayNames(["en"], { type: "region" });

export const COUNTRIES = getCountries()
  .map((code) => ({ value: code, label: names.of(code) ?? code }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const PHONE_COUNTRIES = COUNTRIES.map(({ value, label }) => ({
  value,
  label: `${label} (+${getCountryCallingCode(value)})`,
}));
