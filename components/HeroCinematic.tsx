"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getHeroCopy } from "@/components/hero/heroCopy";
import { HeroRestoredPhotoFill } from "@/components/hero/HeroRestoredPhotoFill";

type Props = {
  sectionId?: string;
  imagePriority?: boolean;
};

/**
 * Alternate hero: wide cinematic band — image fills the frame with a bottom
 * read overlay; headline sits in a restrained left column for editorial feel.
 */
export default function HeroCinematic({
  sectionId = "hero",
  imagePriority: _imagePriority = true,
}: Props) {
  const { lang } = useLanguage();
  const copy = getHeroCopy(lang);

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-[#0f1f4b]"
    >
      <div className="relative min-h-[min(52vh,440px)] w-full sm:aspect-[21/9] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[min(52vh,520px)]">
        <HeroRestoredPhotoFill
          alt={copy.heroImageAlt}
          className="bg-[position:30%_44%] sm:bg-[position:60%_42%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0f1f4b]/95 via-[#0f1f4b]/55 to-transparent md:from-[#0f1f4b]/90 md:via-[#0f1f4b]/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0f1f4b]/90 via-transparent to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 pt-16 sm:px-10 sm:pb-12 sm:pt-24 md:pb-16 md:pl-12 lg:pl-16">
            <div className="max-w-2xl">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                {copy.badge}
              </p>
              <h1 className="font-display text-4xl font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[4rem]">
                {copy.titleLine1}
                <br />
                {copy.titleLine2}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
                {copy.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xs border border-white bg-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0f1f4b] transition-colors hover:bg-white/90"
                >
                  {copy.primaryCta}
                </a>
                <a
                  href="#resultats"
                  className="inline-flex items-center justify-center rounded-xs border border-white/50 bg-transparent px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
                >
                  {copy.secondaryCta}
                </a>
              </div>
            </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0f1f4b] px-4 py-8 sm:px-10 sm:py-10 md:pl-12 lg:pl-16">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-10 gap-y-5 sm:gap-x-14 sm:gap-y-6">
          <div>
            <div className="font-display text-3xl font-semibold text-white sm:text-4xl">
              5<span className="text-amber-400">★</span>{" "}
              <span className="text-lg font-normal text-white/50">Google</span>
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-semibold text-white sm:text-4xl">
              100%
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {copy.satisfaction}
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-semibold text-white sm:text-4xl">
              24H
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {copy.response}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
