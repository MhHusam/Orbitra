"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function SuccessCheck() {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .from(ref.current, { scale: 0.6, autoAlpha: 0, duration: 0.35, ease: "back.out(2)" })
        .from(".js-circle", { drawSVG: "0%", duration: 0.6, ease: "power2.inOut" }, "<")
        .from(".js-tick", { drawSVG: "0%", duration: 0.4, ease: "power2.out" }, "-=0.15");
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="34" className="fill-primary-soft" />
      <circle className="js-circle" cx="36" cy="36" r="33" stroke="var(--color-primary)" strokeWidth="3" />
      <path
        className="js-tick"
        d="M23 37.5 32 46l17-19"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
