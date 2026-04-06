"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getHeroCopy } from "@/components/hero/heroCopy";
import { HeroRestoredPhotoFill } from "@/components/hero/HeroRestoredPhotoFill";

type Props = {
  sectionId?: string;
  imagePriority?: boolean;
};

/**
 * Full-bleed photo with soft white gradient — classic landing layout.
 * Badge matches `Hero.tsx` (institutional bar + navy accent).
 */
export default function HeroClassicBackdrop({
  sectionId = "hero",
  imagePriority: _imagePriority = true,
}: Props) {
  const { lang } = useLanguage();
  const copy = getHeroCopy(lang);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsCanAnimate, setStatsCanAnimate] = useState(false);

  useEffect(() => {
    setStatsCanAnimate(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setStatsCanAnimate(true));
    });
    return () => cancelAnimationFrame(id);
  }, [lang]);

  useEffect(() => {
    if (!statsCanAnimate) return;

    const animateCounter = (el: HTMLElement, target: number) => {
      const duration = 1600;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(ease * target);
        el.textContent = current.toString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toString();
        }
      };

      requestAnimationFrame(tick);
    };

    const id = window.requestAnimationFrame(() => {
      if (!statsRef.current) return;
      const counters = statsRef.current.querySelectorAll("[data-t]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      counters.forEach((counter) => {
        const el = counter as HTMLElement;
        const target = parseInt(el.getAttribute("data-t") || "0", 10);
        if (reduceMotion) {
          el.textContent = target.toString();
          return;
        }
        el.textContent = "0";
        animateCounter(el, target);
      });
    });

    return () => cancelAnimationFrame(id);
  }, [lang, statsCanAnimate]);

  return (
    <section
      id={sectionId}
      className="relative flex min-h-[calc(100lvh-var(--navbar-height,4rem))] items-center overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <HeroRestoredPhotoFill
          alt={copy.heroImageAlt}
          className="bg-[position:22%_68%] sm:bg-[position:68%_center] md:bg-[position:62%_center]"
        />
        {/* Mobile: solid white on left (text zone), fades so truck shows on the right */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to right, rgb(255,255,255) 0%, rgba(255,255,255,0.98) 42%, rgba(255,255,255,0.72) 62%, rgba(255,255,255,0.2) 82%, transparent 100%)",
          }}
          aria-hidden
        />
        {/* Desktop: original left-to-right reveal */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgb(255 255 255) 0%, rgba(255, 255, 255, 0.97) 30%, rgba(255, 255, 255, 0.78) 44%, rgba(255, 255, 255, 0.28) 62%, transparent 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-slate-900/[0.03] sm:bg-slate-900/[0.035]"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] w-full max-w-[1120px] px-5 py-8 sm:px-10 sm:py-16 sm:pl-8 md:py-[clamp(3rem,8vw,5.5rem)] md:pl-12 lg:pl-16">
        <div className="motion-reduce:transition-none">
          <div className="mb-4 md:mb-8">
            <div className="inline-flex items-stretch overflow-hidden border border-slate-200/90 bg-white/90 shadow-[0_1px_0_rgba(15,31,75,0.06)]">
              <span className="w-1 shrink-0 bg-[#0f1f4b]" aria-hidden />
              <span className="min-w-0 px-2.5 py-1.5 text-[7.5px] font-semibold uppercase leading-snug tracking-[0.12em] text-slate-600 sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em]">
                {copy.badge}
              </span>
            </div>
          </div>

          <h1 className="max-w-[14ch] text-balance font-display text-[clamp(2rem,8vw,6.75rem)] font-semibold uppercase leading-[0.94] tracking-[-0.02em] text-[#0f1f4b]">
            {copy.titleLine1}
            <br />
            {copy.titleLine2}
          </h1>

          <p className="mt-4 max-w-[min(20rem,78%)] text-pretty text-[13px] font-normal leading-[1.6] text-slate-800 sm:mt-7 sm:text-base sm:leading-[1.7] sm:max-w-[28rem] md:max-w-[450px]">
            {copy.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3.5">
            <a href="#contact" className="btn-institutional-primary px-5 py-2 text-[9.5px] sm:px-7 sm:py-3 sm:text-[11px]">
              {copy.primaryCta}
            </a>
            <a href="#resultats" className="btn-institutional-secondary bg-white/70 px-5 py-2 text-[9.5px] sm:bg-white sm:px-7 sm:py-3 sm:text-[11px]">
              {copy.secondaryCta}
            </a>
          </div>

          <div
            ref={statsRef}
            className="mt-7 grid grid-cols-3 gap-x-4 sm:mt-14 md:flex md:flex-wrap md:gap-x-14 md:gap-y-8"
          >
            <div>
              <div className="font-display text-[1.5rem] font-semibold leading-none tabular-nums text-[#0f1f4b] sm:text-5xl">
                <span data-t="5">5</span>
                <span className="text-amber-500">★</span>
              </div>
              <div className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:mt-2 sm:text-[10px] sm:tracking-[0.2em]">
                Google
              </div>
            </div>
            <div>
              <div className="font-display text-[1.5rem] font-semibold leading-none tabular-nums text-[#0f1f4b] sm:text-5xl">
                <span data-t="100">100</span>%
              </div>
              <div className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:mt-2 sm:text-[10px] sm:tracking-[0.2em]">
                {copy.satisfaction}
              </div>
            </div>
            <div>
              <div className="font-display text-[1.5rem] font-semibold leading-none tabular-nums text-[#0f1f4b] sm:text-5xl">
                <span data-t="24">24</span>H
              </div>
              <div className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:mt-2 sm:text-[10px] sm:tracking-[0.2em]">
                {copy.response}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
