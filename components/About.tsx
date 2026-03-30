"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { lang } = useLanguage();
  const copy =
    lang === "fr"
      ? {
          eyebrow: "À propos",
          title: "Pourquoi nous choisir",
          description:
            "Avec des années d'expérience dans le nettoyage extérieur, nous sommes le partenaire de confiance qu'il vous faut.",
          image: "Image à propos",
          values: [
            {
              title: "Qualité professionnelle",
              description:
                "Nous utilisons des équipements et des produits de grande qualité pour garantir des résultats durables.",
            },
            {
              title: "Service rapide",
              description:
                "Notre équipe expérimentée travaille efficacement sans compromettre la qualité.",
            },
            {
              title: "Satisfaction garantie",
              description:
                "Votre satisfaction est notre priorité jusqu'à la fin des travaux.",
            },
          ],
        }
      : {
          eyebrow: "About",
          title: "Why Choose Us",
          description:
            "With years of exterior cleaning experience, we are the partner you can rely on.",
          image: "About image",
          values: [
            {
              title: "Professional Quality",
              description:
                "We use high-quality equipment and products to deliver lasting results.",
            },
            {
              title: "Fast Service",
              description:
                "Our experienced team works efficiently without compromising quality.",
            },
            {
              title: "Guaranteed Satisfaction",
              description:
                "Your satisfaction stays our priority until the job is done right.",
            },
          ],
        };
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative h-[480px] overflow-hidden rounded-sm bg-gray-200">
              <img
                src="/about-team.jpg"
                alt={copy.image}
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#0f1f4b]">
              {copy.eyebrow}
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-[#0f1f4b] mb-3 leading-tight">
              {copy.title}
            </h2>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-7">
              {copy.description}
            </p>
            <div className="space-y-4">
              {copy.values.map((value, idx) => (
                <div key={idx} className="flex gap-3.5">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#0f1f4b]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-[#0f1f4b] mb-1">
                      {value.title}
                    </h3>
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
