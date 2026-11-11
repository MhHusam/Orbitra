export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function basePath() {
  if (process.env.NEXT_PUBLIC_BASE_PATH) return process.env.NEXT_PUBLIC_BASE_PATH;
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/demo")) return "/demo";
  return "";
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbitra-4fe539.webflow.io";
