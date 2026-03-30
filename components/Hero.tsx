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
    const animateCounter = (el: HTMLElement, target: number) => {
      const duration = 2200;
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

    if (statsRef.current) {
      const counters = statsRef.current.querySelectorAll("[data-t]");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-t") || "0", 10);
        animateCounter(counter as HTMLElement, target);
      });
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[85vh] items-center overflow-hidden bg-slate-100"
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url(/pressure-cooker.jpg)",
          backgroundPosition: "right center",
        }}
      />
      {/* Horizontal fade: solid white on the left for copy, transparent on the right so the photo reads fully */}
      <div
        className="absolute inset-0"
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
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0f1f4b]/12 bg-[#0f1f4b]/[0.06] px-3 py-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f1f4b]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0f1f4b]">
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
                className="mb-8 max-w-xl text-[15px] leading-relaxed text-gray-600"
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
