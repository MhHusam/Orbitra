"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Icon, type IconName } from "@/app/components/ui/Icon";

const ITEMS: { icon: IconName; minute: string; title: string; text: string }[] = [
  { icon: "database", minute: "Min 0–5", title: "Your leads, in one inbox", text: "We connect a sample of your real form and ad leads, so the demo runs on your data." },
  { icon: "zap", minute: "Min 5–10", title: "Instant routing", text: "Watch a new lead reach the right rep in under a minute, by territory, size or product." },
  { icon: "gauge", minute: "Min 10–15", title: "Lead scoring", text: "See which leads Orbitra puts first and why, with the signals behind every score." },
  { icon: "bell", minute: "Min 15–20", title: "SLA alerts", text: "Set a response target and see how Orbitra nudges reps before a lead goes cold." },
  { icon: "users", minute: "Min 20–30", title: "Your questions", text: "Pricing, CRM sync, security, rollout. We'll plan the next steps with your team." },
];

export function DemoPreviewScroller() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - section.current!.clientWidth);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.from(".js-preview-card", {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: section.current, start: "top 75%" },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="preview-title" className="overflow-hidden bg-ink py-20 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <p className="text-eyebrow font-semibold tracking-[0.08em] text-accent uppercase">30 minutes, on your data</p>
        <h2 id="preview-title" className="mt-3 max-w-xl font-display text-[32px] leading-[40px] font-bold md:text-h2">
          What you&apos;ll see in the demo
        </h2>
      </div>
      <ol
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:px-8 lg:w-max lg:overflow-visible lg:px-[max(2rem,calc((100vw-1200px)/2+2rem))] lg:pb-0"
      >
        {ITEMS.map((item, i) => (
          <li
            key={item.title}
            className="js-preview-card flex w-[82%] max-w-[360px] shrink-0 snap-start flex-col gap-4 rounded-2xl border border-border-on-dark bg-ink-2 p-6 sm:w-[340px] md:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon name={item.icon} size={22} />
              </span>
              <span className="text-small text-muted-on-dark">
                {String(i + 1).padStart(2, "0")} · {item.minute}
              </span>
            </div>
            <h3 className="font-display text-h4 font-bold">{item.title}</h3>
            <p className="text-body text-muted-on-dark">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
