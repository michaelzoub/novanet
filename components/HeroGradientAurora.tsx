"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getHeroCopy } from "@/components/hero/heroCopy";
import { HeroRestoredPhotoFill } from "@/components/hero/HeroRestoredPhotoFill";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  sectionId?: string;
  imagePriority?: boolean;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Y-only motion: avoids Safari compositor flashes from many simultaneous opacity tweens. */
const fadeUp = {
  hidden: { y: 14 },
  show: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.48,
      delay: 0.06 + i * 0.055,
      ease: easeOut,
    },
  }),
};

/** Alternate hero: full-bleed photo with copy on a solid panel (no color wash on the image). */
export default function HeroGradientAurora({
  sectionId = "hero",
  imagePriority: _imagePriority = true,
}: Props) {
  const { lang } = useLanguage();
  const copy = getHeroCopy(lang);
  const reduceMotion = useReducedMotion();

  const cardTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.65, delay: 0.1, ease: easeOut };

  return (
    <section
      id={sectionId}
      className="relative isolate min-h-[min(88svh,860px)] overflow-hidden bg-neutral-200 sm:min-h-[min(90vh,880px)]"
    >
      {/* Static layer: no Motion opacity here (Safari + cover backgrounds tend to “snap”). */}
      <div className="pointer-events-none absolute inset-0">
        <HeroRestoredPhotoFill
          alt={copy.heroImageAlt}
          className="bg-[position:32%_46%] sm:bg-[position:62%_center] md:bg-[position:66%_center] lg:bg-[position:70%_center]"
        />
      </div>

      {/* svh on small screens: stable height when mobile browser chrome shows/hides (dvh jumps). */}
      <div className="relative z-[1] mx-auto flex min-h-[min(88svh,860px)] max-w-[1440px] items-center justify-center px-4 py-10 sm:min-h-[min(90vh,880px)] sm:justify-start sm:px-5 sm:py-16 md:pl-3 md:pr-10 lg:pl-4 xl:pl-5">
        <motion.div
          className="w-full max-w-xl border border-slate-200/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8 md:max-w-[440px] md:p-10 lg:max-w-[480px]"
          initial={reduceMotion ? false : { y: 22 }}
          animate={{ y: 0 }}
          transition={cardTransition}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={lang}
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{
                duration: reduceMotion ? 0.12 : 0.32,
                ease: easeOut,
              }}
            >
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.055,
                      delayChildren: reduceMotion ? 0 : 0.06,
                    },
                  },
                }}
              >
                <motion.div variants={fadeUp} custom={0} className="mb-6">
                  <div className="inline-flex max-w-full items-stretch border border-slate-200/90 bg-slate-50/80">
                    <span className="w-1 shrink-0 bg-[#0f1f4b]" aria-hidden />
                    <span className="max-w-full px-3 py-2 pr-4 text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] text-slate-600 sm:px-4 sm:pr-5 sm:text-[11px] sm:tracking-[0.2em]">
                      {copy.badge}
                    </span>
                  </div>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="font-display text-4xl font-semibold uppercase leading-[1.02] tracking-[-0.02em] text-[#0f1f4b] sm:text-5xl md:text-[3.25rem]"
                >
                  {copy.titleLine1}
                  <br />
                  {copy.titleLine2}
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base"
                >
                  {copy.description}
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <motion.a
                    href="#contact"
                    className="btn-institutional-primary"
                    whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                    whileHover={reduceMotion ? {} : { y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  >
                    {copy.primaryCta}
                  </motion.a>
                  <motion.a
                    href="#resultats"
                    className="btn-institutional-secondary"
                    whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                    whileHover={reduceMotion ? {} : { y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  >
                    {copy.secondaryCta}
                  </motion.a>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  custom={4}
                  className="mt-10 flex flex-wrap gap-10 border-t border-slate-200/90 pt-8"
                >
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
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
