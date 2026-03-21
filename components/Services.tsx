"use client";

import { Monitor, Droplets, Home, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { lang } = useLanguage();

  const copy =
    lang === "fr"
      ? {
          eyebrow: "Ce qu'on fait",
          title: "Nos Services",
          description:
            "Des solutions completes pour remettre a neuf tous les exterieurs de votre propriete dans la region du Grand Montreal.",
          services: [
            {
              icon: Monitor,
              title: "Lavage de Vitres",
              description:
                "Nettoyage interieur et exterieur de toutes vos fenetres. Resultat sans traces, meme sur les vitres difficiles d'acces.",
              tags: ["Residentiel", "Commercial", "Sans traces"],
            },
            {
              icon: Droplets,
              title: "Lavage a Pression",
              description:
                "Elimination efficace des saletes, mousses et taches incrustees sur toutes vos surfaces exterieures.",
              tags: ["Entrees", "Terrasses", "Facades"],
            },
            {
              icon: Home,
              title: "Scellant de Paves",
              description:
                "Application d'un scellant protecteur pour prolonger la duree de vie de vos paves, prevenir les taches et rehausser les couleurs.",
              tags: ["Protection UV", "Anti-taches", "Longevite"],
            },
            {
              icon: Clock,
              title: "Sablage de Paves",
              description:
                "Restauration complete de vos paves par sablage pour eliminer les taches tenaces et redonner leur eclat d'origine.",
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
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#2563eb]">
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
              className="rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-[#2563eb]/30 hover:shadow-md"
            >
              <service.icon className="mb-3.5 h-7 w-7 text-[#2563eb]" />
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
