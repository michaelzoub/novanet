"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { lang } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);

  const copy =
    lang === "fr"
      ? {
          badge: "Grand Montreal - Service Professionnel",
          titleTop: "VOYEZ LA",
          titleBottom: "DIFFERENCE",
          description:
            "Lavage de vitres interieur et exterieur, lavage a pression, scellant de paves et sablage - on redonne a votre propriete l'eclat qu'elle merite.",
          primaryCta: "Obtenir une soumission",
          secondaryCta: "Voir nos resultats",
          satisfaction: "Satisfaction",
          response: "Reponse",
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
      className="relative flex min-h-[85vh] items-center overflow-hidden bg-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-10"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg width="1200" height="800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23e5e7eb" width="1200" height="800"/%3E%3C/svg%3E\')',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-16 md:px-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#2563eb]">
            {copy.badge}
          </span>
        </div>
        <h1 className="mb-5 max-w-4xl font-display text-5xl font-bold uppercase leading-[0.95] text-[#0f1f4b] md:text-7xl lg:text-8xl">
          {copy.titleTop}
          <br />
          {copy.titleBottom}
        </h1>
        <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-gray-600">
          {copy.description}
        </p>
        <div className="mb-12 flex flex-wrap gap-3">
          <Link
            href="#contact"
            className="rounded bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            {copy.primaryCta}
          </Link>
          <Link
            href="#resultats"
            className="rounded border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-[#0f1f4b] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]"
          >
            {copy.secondaryCta}
          </Link>
        </div>
        <div ref={statsRef} className="flex gap-10">
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
        </div>
      </div>
    </section>
  );
}
