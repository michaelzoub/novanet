export type HeroLang = "fr" | "en";

export function getHeroCopy(lang: HeroLang) {
  return lang === "fr"
    ? {
        badge: "Grand Montréal · Service professionnel",
        heroImageAlt:
          "Véhicule et équipe Nova Net pour lavage extérieur professionnel.",
        titleLine1: "VOYEZ LA",
        titleLine2: "DIFFÉRENCE",
        description:
          "Lavage de vitres intérieur et extérieur, lavage à pression, scellant de pavés et sablage : nous redonnons à votre propriété l'éclat qu'elle mérite.",
        primaryCta: "Obtenir une soumission",
        secondaryCta: "Voir nos résultats",
        satisfaction: "Satisfaction",
        response: "Réponse",
      }
    : {
        badge: "Greater Montreal · Professional service",
        heroImageAlt:
          "Nova Net fleet and equipment for professional exterior cleaning.",
        titleLine1: "SEE THE",
        titleLine2: "DIFFERENCE",
        description:
          "Interior and exterior window washing, pressure washing, paver sealing, and sanding — we bring your property back to its best.",
        primaryCta: "Get a quote",
        secondaryCta: "See our results",
        satisfaction: "Satisfaction",
        response: "Response",
      };
}
