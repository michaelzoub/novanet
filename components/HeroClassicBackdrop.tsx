"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getHeroCopy } from "@/components/hero/heroCopy";
import { HeroRestoredPhotoFill } from "@/components/hero/HeroRestoredPhotoFill";

type Props = {
  sectionId?: string;
  imagePriority?: boolean;
};

/**
 * Alternate hero: mirrors the static `novanet_site-32.html` layout — full-bleed
 * photo on the right, soft white gradient wash, badge + headline + stats on the left.
 */
export default function HeroClassicBackdrop({
  sectionId = "hero",
  imagePriority: _imagePriority = true,
}: Props) {
  const { lang, ready } = useLanguage();
  const copy = getHeroCopy(lang);

  return (
    <section
      id={sectionId}
      className="relative flex min-h-[min(100dvh,920px)] items-center overflow-hidden bg-white sm:min-h-[calc(100vh-4rem)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <HeroRestoredPhotoFill
          alt={copy.heroImageAlt}
          className="bg-[position:36%_center] sm:bg-[position:72%_center]"
        />
        {/* Same idea as `.hgrad` in the static HTML */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white from-0% via-white/95 via-[38%] to-transparent to-[100%]"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] w-full max-w-[1100px] px-5 py-12 pl-6 sm:px-10 sm:py-16 sm:pl-8 md:py-20 md:pl-12 lg:pl-16">
        {ready ? (
          <>
            <p className="mb-7 max-w-full text-balance">
              <span className="inline-block rounded-full bg-[#0f1f4b]/[0.09] px-3.5 py-2 text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] text-[#0f1f4b] sm:text-[11px] sm:tracking-[0.2em]">
                {copy.badge}
              </span>
            </p>

            <h1 className="font-display text-[clamp(3rem,8vw,6.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-[#0f1f4b]">
              {copy.titleLine1}
              <br />
              {copy.titleLine2}
            </h1>

            <p className="mt-6 max-w-[450px] text-base leading-[1.7] text-slate-600">
              {copy.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <a href="#contact" className="btn-institutional-primary">
                {copy.primaryCta}
              </a>
              <a href="#resultats" className="btn-institutional-secondary">
                {copy.secondaryCta}
              </a>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-slate-200/90 pt-10">
              <div>
                <div className="font-display text-5xl font-bold leading-none text-[#0f1f4b]">
                  5<span className="text-amber-500">★</span>
                </div>
                <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Google
                </div>
              </div>
              <div>
                <div className="font-display text-5xl font-bold leading-none text-[#0f1f4b]">
                  100%
                </div>
                <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {copy.satisfaction}
                </div>
              </div>
              <div>
                <div className="font-display text-5xl font-bold leading-none text-[#0f1f4b]">
                  24H
                </div>
                <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {copy.response}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
