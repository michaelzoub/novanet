"use client";

import MapBox from "./MapBox";
import { useLanguage } from "@/context/LanguageContext";

const zones = [
  "Montréal",
  "Laval",
  "Longueuil",
  "Brossard",
  "Westmount",
  "Outremont",
  "Verdun",
  "Hampstead",
];

export default function Zones() {
  const { lang } = useLanguage();
  const copy =
    lang === "fr"
      ? {
          eyebrow: "Zones de service",
          title: "Ou Nous Servons",
          description:
            "Nous offrons nos services professionnels dans toute la region du Grand Montreal.",
        }
      : {
          eyebrow: "Service Area",
          title: "Where We Work",
          description:
            "We provide our professional services across the Greater Montreal area.",
        };
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="text-[10px] font-semibold uppercase tracking-[2px] text-[#2563eb] mb-2">
          {copy.eyebrow}
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-[#0f1f4b] mb-3 leading-tight">
          {copy.title}
        </h2>
        <p className="text-[15px] text-gray-600 max-w-xl leading-relaxed mb-8">
          {copy.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-12">
          {zones.map((zone, idx) => (
            <button
              key={idx}
              className="border border-gray-200 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-gray-700 hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-blue-50/50 transition-colors"
            >
              {zone}
            </button>
          ))}
        </div>
        <MapBox />
      </div>
    </section>
  );
}
