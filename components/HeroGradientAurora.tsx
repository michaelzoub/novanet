"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getHeroCopy } from "@/components/hero/heroCopy";
import { HeroRestoredPhotoFill } from "@/components/hero/HeroRestoredPhotoFill";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  sectionId?: string;
  imagePriority?: boolean;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Alternate hero: full-bleed photo with copy on a solid panel (no color wash on the image). */
export default function HeroGradientAurora({
  sectionId = "hero",
  imagePriority: _imagePriority = true,
}: Props) {
  const { lang, ready } = useLanguage();
  const copy = getHeroCopy(lang);
  const reduceMotion = useReducedMotion();

  const cardTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.55, ease: easeOut };

  return (
    <section
      id={sectionId}
      className="relative flex min-h-[calc(100lvh-var(--navbar-height,4rem))] flex-col overflow-x-hidden bg-neutral-200"
      aria-busy={!ready}
    >
      <div className="pointer-events-none absolute inset-0">
        <HeroRestoredPhotoFill
          alt={copy.heroImageAlt}
          className="bg-[position:32%_46%] sm:bg-[position:62%_center] md:bg-[position:66%_center] lg:bg-[position:70%_center]"
        />
      </div>

      <div className="relative z-[1] mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center px-4 py-10 sm:justify-start sm:px-5 sm:py-16 md:pl-3 md:pr-10 lg:pl-4 xl:pl-5">
        {!ready ? (
          <div
            className="w-full max-w-xl min-h-[min(22rem,42svh)] rounded-xs border border-transparent p-5 sm:min-h-[min(26rem,48svh)] sm:p-8 md:max-w-[440px] md:p-10 lg:max-w-[480px]"
            aria-hidden
          />
        ) : (
          <motion.div
            className="w-full max-w-xl border border-slate-200/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8 md:max-w-[440px] md:p-10 lg:max-w-[480px]"
            initial={reduceMotion ? false : { y: 20 }}
            animate={{ y: 0 }}
            transition={cardTransition}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            {/* No key={lang}: language swaps instantly without exit/mount flashes. */}
            <div className="mb-6 inline-flex max-w-full items-stretch border border-slate-200/90 bg-slate-50/80">
              <span className="w-1 shrink-0 bg-[#0f1f4b]" aria-hidden />
              <span className="max-w-full px-3 py-2 pr-4 text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] text-slate-600 sm:px-4 sm:pr-5 sm:text-[11px] sm:tracking-[0.2em]">
                {copy.badge}
              </span>
            </div>

            <h1 className="font-display text-4xl font-semibold uppercase leading-[1.02] tracking-[-0.02em] text-[#0f1f4b] sm:text-5xl md:text-[3.25rem]">
              {copy.titleLine1}
              <br />
              {copy.titleLine2}
            </h1>

            <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              {copy.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-institutional-primary">
                {copy.primaryCta}
              </a>
              <a href="#resultats" className="btn-institutional-secondary">
                {copy.secondaryCta}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-10 border-t border-slate-200/90 pt-8">
              <div>
                <div className="font-display text-3xl font-semibold tabular-nums text-[#0f1f4b] sm:text-4xl">
                  5★
                </div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Google
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold tabular-nums text-[#0f1f4b] sm:text-4xl">
                  100%
                </div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {copy.satisfaction}
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold tabular-nums text-[#0f1f4b] sm:text-4xl">
                  24H
                </div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {copy.response}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
