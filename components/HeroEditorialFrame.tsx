"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getHeroCopy } from "@/components/hero/heroCopy";
import { HeroRestoredPhotoFill } from "@/components/hero/HeroRestoredPhotoFill";

type Props = {
  sectionId?: string;
  imagePriority?: boolean;
};

/**
 * Alternate hero: editorial split — copy on a calm white field, image in a
 * framed panel with subtle shadow (strong “agency” presentation).
 */
export default function HeroEditorialFrame({
  sectionId = "hero",
  imagePriority: _imagePriority = true,
}: Props) {
  const { lang } = useLanguage();
  const copy = getHeroCopy(lang);

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-slate-50"
    >
      <div className="mx-auto grid max-w-[1400px] gap-0 md:min-h-[min(88vh,900px)] md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-4 md:px-8 md:py-12 lg:px-12">
        <div className="order-2 flex flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 md:order-1 md:py-16 md:pr-6 lg:pl-4">
            <>
              <div className="mb-6 inline-flex max-w-full items-stretch border border-slate-200/90 bg-white shadow-[0_1px_0_rgba(15,31,75,0.06)]">
                <span className="w-1 shrink-0 bg-[#0f1f4b]" aria-hidden />
                <span className="whitespace-nowrap px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:px-4 sm:text-[11px]">
                  {copy.badge}
                </span>
              </div>

              <h1 className="font-display text-4xl font-semibold uppercase leading-[1.02] tracking-[-0.02em] text-[#0f1f4b] sm:text-5xl md:text-[3.5rem] lg:text-[4rem]">
                {copy.titleLine1}
                <br />
                {copy.titleLine2}
              </h1>

              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {copy.description}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#contact" className="btn-institutional-primary">
                  {copy.primaryCta}
                </a>
                <a href="#resultats" className="btn-institutional-secondary">
                  {copy.secondaryCta}
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-10 border-t border-slate-200/90 pt-9">
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
            </>
        </div>

        <div className="order-1 px-4 pb-2 pt-6 sm:px-8 sm:pt-8 md:order-2 md:px-4 md:py-8">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xs border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(15,31,75,0.12)] md:aspect-[5/6] md:max-w-none">
            <HeroRestoredPhotoFill
              alt={copy.heroImageAlt}
              className="bg-[position:34%_center] sm:bg-[position:56%_center]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-900/[0.03] to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
