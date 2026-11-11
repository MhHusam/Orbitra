export const BLOCKED_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk", "ymail.com", "rocketmail.com",
  "hotmail.com", "outlook.com", "live.com", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "gmx.com", "gmx.net", "mail.com", "zoho.com",
  "yandex.com", "yandex.ru", "proton.me", "protonmail.com",
  "mailinator.com", "guerrillamail.com", "sharklasers.com",
  "10minutemail.com", "tempmail.com", "temp-mail.org",
  "yopmail.com", "trashmail.com", "getnada.com",
  "maildrop.cc", "dispostable.com", "throwawaymail.com", "fakeinbox.com",
]);

export function getEmailDomain(email: string): string {
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  return at === -1 ? "" : value.slice(at + 1);
}

export function isWorkEmail(email: string): boolean {
  const domain = getEmailDomain(email);
  return domain.length > 0 && !BLOCKED_EMAIL_DOMAINS.has(domain);
}
