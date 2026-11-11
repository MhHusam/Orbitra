export const DEMO_TIMEZONE = "Asia/Dubai";
export const MAX_DAYS_AHEAD = 30;

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function todayInDubai(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DEMO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function parseIsoDate(value: string): number | null {
  if (!ISO_DATE.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const ms = Date.UTC(y, m - 1, d);
  return toIsoDate(ms) === value ? ms : null;
}

function toIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function isWeekend(ms: number): boolean {
  const day = new Date(ms).getUTCDay();
  return day === 0 || day === 6;
}

export function firstDemoDate(now: Date = new Date()): string {
  let ms = parseIsoDate(todayInDubai(now))! + DAY_MS;
  while (isWeekend(ms)) ms += DAY_MS;
  return toIsoDate(ms);
}

export function lastDemoDate(now: Date = new Date()): string {
  return toIsoDate(parseIsoDate(todayInDubai(now))! + MAX_DAYS_AHEAD * DAY_MS);
}

export function isAllowedDemoDate(date: string, now: Date = new Date()): boolean {
  const ms = parseIsoDate(date);
  if (ms === null || isWeekend(ms)) return false;
  return date >= firstDemoDate(now) && date <= lastDemoDate(now);
}
