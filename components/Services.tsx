"use client";

import { Monitor, Droplets, Home, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { lang } = useLanguage();

  const copy =
    lang === "fr"
      ? {
          eyebrow: "Ce qu'on fait",
          title: "Nos services",
          description:
            "Des solutions complètes pour remettre à neuf tous les extérieurs de votre propriété dans la région du Grand Montréal.",
          services: [
            {
              icon: Monitor,
              title: "Lavage de vitres",
              description:
                "Nettoyage intérieur et extérieur de toutes vos fenêtres. Résultat sans traces, même sur les vitres difficiles d'accès.",
              tags: ["Résidentiel", "Commercial", "Sans traces"],
            },
            {
              icon: Droplets,
              title: "Lavage à pression",
              description:
                "Élimination efficace des salissures, mousses et taches incrustées sur toutes vos surfaces extérieures.",
              tags: ["Entrées", "Terrasses", "Façades"],
            },
            {
              icon: Home,
              title: "Scellant de pavés",
              description:
                "Application d'un scellant protecteur pour prolonger la durée de vie de vos pavés, prévenir les taches et rehausser les couleurs.",
              tags: ["Protection UV", "Anti-taches", "Longévité"],
            },
            {
              icon: Clock,
              title: "Sablage de pavés",
              description:
                "Restauration complète de vos pavés par sablage pour éliminer les taches tenaces et leur redonner leur éclat d'origine.",
              tags: ["Restauration", "Professionnel", "Durable"],
            },
          ],
        }
      : {
          eyebrow: "What we do",
          title: "Our Services",
          description:
            "Complete solutions to refresh every exterior surface on your property across Greater Montreal.",
          services: [
            {
              icon: Monitor,
              title: "Window Washing",
              description:
                "Interior and exterior window cleaning with streak-free results, even on hard-to-reach glass.",
              tags: ["Residential", "Commercial", "Streak-free"],
            },
            {
              icon: Droplets,
              title: "Pressure Washing",
              description:
                "Effective removal of dirt, moss, and deep stains from your exterior surfaces.",
              tags: ["Driveways", "Decks", "Facades"],
            },
            {
              icon: Home,
              title: "Paver Sealing",
              description:
                "Protective sealing that extends paver life, helps prevent stains, and enhances colour.",
              tags: ["UV Protection", "Stain Resistant", "Long-lasting"],
            },
            {
              icon: Clock,
              title: "Paver Sanding",
              description:
                "Full paver restoration through sanding to remove tough stains and restore the original finish.",
              tags: ["Restoration", "Professional", "Durable"],
            },
          ],
        };

  return (
    <section id="services" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#0f1f4b]">
          {copy.eyebrow}
        </div>
        <h2 className="mb-3 font-display text-4xl font-bold uppercase leading-tight text-[#0f1f4b] md:text-5xl lg:text-6xl">
          {copy.title}
        </h2>
        <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          {copy.description}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {copy.services.map((service, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-[#0f1f4b]/30 hover:shadow-md"
            >
              <service.icon className="mb-3.5 h-7 w-7 text-[#0f1f4b]" />
              <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-[#0f1f4b]">
                {service.title}
              </h3>
              <p className="mb-4 text-[13px] leading-relaxed text-gray-600">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
