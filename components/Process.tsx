"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Process() {
  const { lang } = useLanguage();
  const copy =
    lang === "fr"
      ? {
          eyebrow: "Comment ça marche",
          title: "Notre processus",
          description:
            "Un processus simple et transparent pour répondre à tous vos besoins de nettoyage extérieur.",
          steps: [
            {
              number: "01",
              title: "Demande de soumission",
              description:
                "Contactez-nous pour une évaluation gratuite de vos besoins en nettoyage extérieur.",
            },
            {
              number: "02",
              title: "Inspection et devis",
              description:
                "Notre équipe inspecte votre propriété et vous fournit un devis détaillé et transparent.",
            },
            {
              number: "03",
              title: "Planification",
              description:
                "Nous planifions l'intervention selon vos disponibilités et nos créneaux optimaux.",
            },
            {
              number: "04",
              title: "Réalisation",
              description:
                "Notre équipe qualifiée effectue le travail avec professionnalisme et souci du détail.",
            },
          ],
        }
      : {
          eyebrow: "How it works",
          title: "Our Process",
          description:
            "A simple, transparent process built around your exterior cleaning needs.",
          steps: [
            {
              number: "01",
              title: "Request a quote",
              description:
                "Contact us for a free assessment of your exterior cleaning needs.",
            },
            {
              number: "02",
              title: "Inspection and estimate",
              description:
                "Our team inspects your property and provides a detailed, transparent estimate.",
            },
            {
              number: "03",
              title: "Scheduling",
              description:
                "We schedule the work around your availability and the best service window.",
            },
            {
              number: "04",
              title: "Execution",
              description:
                "Our qualified team completes the work with professionalism and attention to detail.",
            },
          ],
        };
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="text-[10px] font-semibold uppercase tracking-[2px] text-[#0f1f4b] mb-2">
          {copy.eyebrow}
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-[#0f1f4b] mb-3 leading-tight">
          {copy.title}
        </h2>
        <p className="text-[15px] text-gray-600 max-w-xl leading-relaxed mb-10">
          {copy.description}
        </p>
        <div className="space-y-5">
          {copy.steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="font-display text-xl font-bold text-[#0f1f4b] min-w-[30px]">
                {step.number}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0f1f4b] mb-1">
                  {step.title}
                </h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
