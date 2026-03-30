"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function MapLegend() {
  const { lang } = useLanguage();
  const copy =
    lang === "fr"
      ? {
          title: "Légende de la carte",
          dashedLabel: "Zone desservie",
          boundary:
            "Nous intervenons à l’intérieur de la zone en pointillés (île de Montréal).",
        }
      : {
          title: "Map legend",
          dashedLabel: "Service area",
          boundary:
            "We serve inside the dotted area — our Island of Montreal coverage.",
        };

  return (
    <div className="flex justify-end absolute bottom-4 right-4">
      <div className="bg-white p-3 rounded-sm shadow-sm max-w-xs border border-gray-200">
        <h3 className="font-semibold text-sm mb-2 text-[#0f1f4b]">
          {copy.title}
        </h3>
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-block h-0 w-8 shrink-0 border-t-2 border-dashed border-[#0f1f4b] opacity-90"
            aria-hidden
          />
          <span className="text-[11px] font-medium text-[#0f1f4b]">
            {copy.dashedLabel}
          </span>
        </div>
        <p className="text-[11px] leading-snug text-gray-500">{copy.boundary}</p>
      </div>
    </div>
  );
}
