"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Hero() {
  const { lang, ready } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);

  const copy =
    lang === "fr"
      ? {
          badge: "Grand Montréal — Service professionnel",
          titleTop: "VOYEZ LA",
          titleBottom: "DIFFÉRENCE",
          description:
            "Lavage de vitres intérieur et extérieur, lavage à pression, scellant de pavés et sablage : nous redonnons à votre propriété l'éclat qu'elle mérite.",
          primaryCta: "Obtenir une soumission",
          secondaryCta: "Voir nos résultats",
          satisfaction: "Satisfaction",
          response: "Réponse",
        }
      : {
          badge: "Greater Montreal - Professional Service",
          titleTop: "SEE THE",
          titleBottom: "DIFFERENCE",
          description:
            "Interior and exterior window washing, pressure washing, paver sealing, and sanding - we bring your property back to its best.",
          primaryCta: "Get a quote",
          secondaryCta: "See our results",
          satisfaction: "Satisfaction",
          response: "Response",
        };

  useEffect(() => {
    if (!ready) return;

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
        const target = parseInt(counter.getAttribute("data-t") || "0", 10);
        animateCounter(counter as HTMLElement, target);
      });
    });

    return () => cancelAnimationFrame(id);
  }, [ready]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[85vh] items-center overflow-hidden bg-slate-100"
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat max-md:bg-[length:cover] max-md:bg-[position:62%_center] md:bg-[position:right_center]"
        style={{
          backgroundImage: "url(/pressure-cooker.jpg)",
        }}
      />
      {/* Mobile: softer fade on the right so equipment stays visible */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to right, rgb(255 255 255) 0%, rgb(255 255 255) 14%, rgba(255 255 255 / 0.64) 32%, rgba(255 255 255 / 0.18) 58%, rgba(255 255 255 / 0) 86%)",
        }}
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgb(255 255 255) 0%, rgb(255 255 255) 28%, rgba(255 255 255 / 0.94) 44%, rgba(255 255 255 / 0.45) 62%, rgba(255 255 255 / 0.12) 78%, rgba(255 255 255 / 0) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-16 md:px-16">
        <AnimatePresence mode="wait" initial={false}>
          {ready ? (
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 inline-flex max-w-[90vw] items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis rounded-full border border-[#0f1f4b]/12 bg-[#0f1f4b]/[0.06] px-2 py-1.5 sm:px-3 sm:py-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f1f4b]" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-[#0f1f4b] sm:text-[10px]">
                  {copy.badge}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 max-w-4xl font-display text-5xl font-bold uppercase leading-[0.95] text-[#0f1f4b] md:text-7xl lg:text-8xl"
              >
                {copy.titleTop}
                <br />
                {copy.titleBottom}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8 max-w-xl text-[14px] leading-relaxed text-slate-700 sm:text-[15px]"
              >
                {copy.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12 flex flex-wrap gap-4"
              >
                <a href="#contact" className="btn-institutional-primary">
                  {copy.primaryCta}
                </a>
                <a href="#resultats" className="btn-institutional-secondary">
                  {copy.secondaryCta}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                ref={statsRef}
                className="flex gap-10"
              >
                <div>
                  <div className="font-display text-4xl font-bold leading-none text-[#0f1f4b]">
                    <span data-t="5">0</span>★
                  </div>
                  <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    Google
                  </div>
                </div>
                <div>
                  <div className="font-display text-4xl font-bold leading-none text-[#0f1f4b]">
                    <span data-t="100">0</span>%
                  </div>
                  <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    {copy.satisfaction}
                  </div>
                </div>
                <div>
                  <div className="font-display text-4xl font-bold leading-none text-[#0f1f4b]">
                    <span data-t="24">0</span>H
                  </div>
                  <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    {copy.response}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
