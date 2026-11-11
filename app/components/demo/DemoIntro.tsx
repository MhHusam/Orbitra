"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function DemoIntro({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create(".js-split", { type: "lines,words", mask: "lines", aria: "auto" });
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(split.lines, { yPercent: 110, duration: 0.8, stagger: 0.08 })
        .from(".js-hero-fade", { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.5");
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
