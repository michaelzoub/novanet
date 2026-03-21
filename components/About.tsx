"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const values = [
  {
    title: "Qualité Professionnelle",
    description:
      "Nous utilisons uniquement des équipements et produits de qualité supérieure pour garantir des résultats durables.",
  },
  {
    title: "Service Rapide",
    description:
      "Notre équipe expérimentée travaille efficacement pour minimiser les délais sans compromettre la qualité.",
  },
  {
    title: "Satisfaction Garantie",
    description:
      "Votre satisfaction est notre priorité. Nous ne considérons pas le travail terminé tant que vous n'êtes pas entièrement satisfait.",
  },
];

export default function About() {
  const { lang } = useLanguage();
  const copy =
    lang === "fr"
      ? {
          eyebrow: "A propos",
          title: "Pourquoi Nous Choisir",
          description:
            "Avec des annees d'experience dans le nettoyage exterieur, nous sommes votre partenaire de confiance.",
          image: "Image a propos",
          values: [
            {
              title: "Qualite Professionnelle",
              description:
                "Nous utilisons des equipements et produits de qualite superieure pour garantir des resultats durables.",
            },
            {
              title: "Service Rapide",
              description:
                "Notre equipe experimentee travaille efficacement sans compromettre la qualite.",
            },
            {
              title: "Satisfaction Garantie",
              description:
                "Votre satisfaction est notre priorite jusqu'a la fin du travail.",
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
            <div className="rounded-lg overflow-hidden h-[480px] bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">{copy.image}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[2px] text-[#2563eb] mb-2">
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
                  <div className="w-5 h-5 rounded-full bg-[#2563eb] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
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
