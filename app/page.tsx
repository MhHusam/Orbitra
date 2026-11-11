import type { Metadata } from "next";
import { DemoIntro } from "@/app/components/demo/DemoIntro";
import { DemoForm } from "@/app/components/demo/DemoForm";
import { DemoPreviewScroller } from "@/app/components/demo/DemoPreviewScroller";
import { Icon } from "@/app/components/ui/Icon";
import { SITE_URL } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Book a demo · Orbitra",
  description: "Book a 30-minute Orbitra demo and see instant lead routing on your own leads.",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const POINTS = [
  "30 minutes with a product specialist",
  "Runs on a sample of your own leads",
  "No commitment, no credit card",
];

export default function DemoPage() {
  return (
    <>
      <a href="#demo-form" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-[var(--shadow-focus)]">
        Skip to the form
      </a>

      <header className="border-b border-border bg-white">
        <nav aria-label="Main" className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-4 md:px-8">
          <a href={SITE_URL} className="flex items-center gap-2.5 rounded-md font-display text-[20px] font-bold text-ink focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/logo-mark.svg`} alt="" width={28} height={28} />
            Orbitra
          </a>
          <a href={SITE_URL} className="flex items-center gap-1.5 text-small font-medium text-muted hover:text-ink">
            <Icon name="arrow-left" size={16} /> Back to site
          </a>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 md:px-8 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <DemoIntro className="flex flex-col gap-6 lg:sticky lg:top-12 lg:self-start">
            <p className="js-hero-fade text-eyebrow font-semibold tracking-[0.08em] text-primary uppercase">Book a demo</p>
            <h1 className="js-split font-display text-[40px] leading-[46px] font-bold tracking-[-0.02em] md:text-[56px] md:leading-[62px]">
              See Orbitra route your leads in real time
            </h1>
            <p className="js-hero-fade text-body-l text-muted">
              Tell us about you and your team. We&apos;ll set up a demo on your own leads and show you how to answer every one in minutes, not days.
            </p>
            <ul className="js-hero-fade flex flex-col gap-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3 text-body text-ink">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-[#0f9e7a]">
                    <Icon name="check" size={14} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </DemoIntro>

          <div id="demo-form">
            <DemoForm />
          </div>
        </section>

        <DemoPreviewScroller />
      </main>

      <footer className="border-t border-border-on-dark bg-ink py-8 text-small text-muted-on-dark">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-2 px-4 sm:flex-row md:px-8">
          <p>© {new Date().getFullYear()} Orbitra. A made-up product for a web dev assignment.</p>
          <a href={SITE_URL} className="hover:text-white">orbitra.webflow.io</a>
        </div>
      </footer>
    </>
  );
}
