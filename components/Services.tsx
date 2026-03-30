"use client";

import { useRef } from "react";
import { Monitor, Droplets, Home, Clock } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Services() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-48px" });

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
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
                delayChildren: reduceMotion ? 0 : 0.05,
              },
            },
          }}
        >
          {copy.services.map((service, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: {
                  opacity: 0,
                  x: reduceMotion ? 0 : -32,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: reduceMotion ? 0.01 : 0.58,
                    ease: EASE,
                  },
                },
              }}
              className="flex h-full min-w-0 flex-col rounded-sm border border-gray-200 bg-white p-8 md:p-9 transition-all duration-300 ease-out hover:border-[#0f1f4b]/30 hover:shadow-md"
            >
              <div
                className="mb-5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0f1f4b] text-white"
                aria-hidden
              >
                <service.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-display mb-3 text-sm font-bold uppercase tracking-wide text-[#0f1f4b]">
                {service.title}
              </h3>
              <p className="mb-6 flex-1 text-[13px] leading-relaxed text-gray-600">
                {service.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-2">
                {service.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="rounded-full border border-gray-100 bg-gray-50/90 px-2.5 py-0.5 text-[11px] font-normal text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
