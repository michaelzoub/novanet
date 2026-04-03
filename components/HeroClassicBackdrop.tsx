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
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <HeroRestoredPhotoFill
          alt={copy.heroImageAlt}
          className="bg-[position:72%_center]"
        />
        {/* Same idea as `.hgrad` in the static HTML */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white from-0% via-white/95 via-[38%] to-transparent to-[100%]"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] w-full max-w-[1100px] px-6 py-16 pl-8 sm:px-10 md:py-20 md:pl-12 lg:pl-16">
        {ready ? (
          <>
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-xs border border-blue-200/80 bg-blue-50/70 px-4 py-1.5">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-xs bg-[#2563eb]"
                aria-hidden
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563eb]">
                {copy.badge}
              </span>
            </div>

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
