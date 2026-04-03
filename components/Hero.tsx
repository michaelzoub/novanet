"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getHeroCopy } from "@/components/hero/heroCopy";
import { HeroRestoredPhotoFill } from "@/components/hero/HeroRestoredPhotoFill";

type HeroProps = {
  sectionId?: string;
  imagePriority?: boolean;
};

export default function Hero({
  sectionId = "hero",
  imagePriority: _imagePriority = true,
}: HeroProps) {
  const { lang } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsCanAnimate, setStatsCanAnimate] = useState(false);
  const copy = getHeroCopy(lang);

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
      counters.forEach((counter) => {
        (counter as HTMLElement).textContent = "0";
        const target = parseInt(counter.getAttribute("data-t") || "0", 10);
        animateCounter(counter as HTMLElement, target);
      });
    });

    return () => cancelAnimationFrame(id);
  }, [lang, statsCanAnimate]);

  return (
    <section id={sectionId} className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1600px] md:min-h-[min(88vh,920px)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="order-2 flex items-center border-slate-100 bg-white px-4 py-8 sm:px-8 sm:py-12 md:order-1 md:border-r md:py-20 md:pl-12 md:pr-10 lg:pl-16 lg:pr-12">
          <div className="w-full max-w-xl lg:max-w-none lg:pr-4">
            <div
              className="motion-reduce:transition-none"
              onAnimationEnd={() => setStatsCanAnimate(true)}
            >
              <div className="mb-5 inline-flex max-w-full items-stretch border border-slate-200/90 bg-slate-50/60 shadow-[0_1px_0_rgba(15,31,75,0.06)] md:mb-7">
                <span
                  className="w-1 shrink-0 bg-[#0f1f4b]"
                  aria-hidden
                />
                <span className="px-3 py-2 text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] text-slate-600 sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em]">
                  {copy.badge}
                </span>
              </div>

              <h1 className="mb-4 max-w-3xl font-display text-4xl font-semibold uppercase leading-[1.02] tracking-[-0.02em] text-[#0f1f4b] sm:mb-5 sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[0.98]">
                {copy.titleLine1}
                <br />
                {copy.titleLine2}
              </h1>

              <p className="mb-7 max-w-lg text-[15px] font-normal leading-[1.65] text-slate-600 sm:mb-9 sm:text-base">
                {copy.description}
              </p>

              <div className="mb-12 flex flex-wrap gap-3 sm:gap-4">
                <a href="#contact" className="btn-institutional-primary">
                  {copy.primaryCta}
                </a>
                <a href="#resultats" className="btn-institutional-secondary">
                  {copy.secondaryCta}
                </a>
              </div>

              <div
                ref={statsRef}
                className="flex flex-wrap gap-x-10 gap-y-7 border-t border-slate-200/80 pt-8 sm:gap-x-12 sm:gap-y-8 sm:pt-10"
              >
                <div>
                  <div className="font-display text-3xl font-semibold leading-none tabular-nums text-[#0f1f4b] sm:text-4xl">
                    <span data-t="5">5</span>★
                  </div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Google
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold leading-none tabular-nums text-[#0f1f4b] sm:text-4xl">
                    <span data-t="100">100</span>%
                  </div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {copy.satisfaction}
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold leading-none tabular-nums text-[#0f1f4b] sm:text-4xl">
                    <span data-t="24">24</span>H
                  </div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {copy.response}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative order-1 h-[min(26svh,220px)] min-h-[156px] max-h-[220px] shrink-0 md:h-auto md:max-h-none md:min-h-[min(88vh,920px)]">
          <HeroRestoredPhotoFill
            alt={copy.heroImageAlt}
            className="bg-[position:34%_40%] sm:bg-[position:60%_center] md:bg-[position:56%_center]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-slate-900/[0.025] md:bg-slate-900/[0.04]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-14 bg-gradient-to-r from-white via-white/40 to-transparent md:block"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
