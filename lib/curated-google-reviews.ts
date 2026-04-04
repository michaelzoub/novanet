/**
 * Avis affichés dans novanet_site-32.html (PFR / PEN) — pas d’API Google côté statique.
 * Utilisé en secours quand Places ne renvoie rien ou que la clé n’est pas configurée.
 */
export const NOVANET_GOOGLE_BUSINESS_SHARE_URL =
  "https://share.google/0gXX1ufLW8A91Oe0h";

export const CURATED_GOOGLE_META = {
  rating: 5.0,
  userRatingsTotal: 12,
  placeName: "Nova Net Lavage Extérieur",
} as const;

type Curated = {
  id: string;
  name: string;
  rating: number;
  textFr: string;
  textEn: string;
  dateFr: string;
  dateEn: string;
};

const curated: Curated[] = [
  {
    id: "curated-google-1",
    name: "Sophie Morin",
    rating: 5,
    textFr:
      "J'ai fait nettoyer le pave uni de l'entree principale et refaire les joints avec du sable polymere; le resultat est exceptionnel. Le travail est professionnel et Luca est courtois. J'ai aussi fait nettoyer les fenetres a l'interieur et l'exterieur. Mes vitres n'ont jamais ete aussi propres grace a Louis-Philippe. C'est la meilleure compagnie avec qui j'ai traite.",
    textEn:
      "I had my entrance paving stones cleaned and joints redone with polymer sand - exceptional result. Also had windows cleaned inside and out. My windows have never been so clean thanks to Louis-Philippe. Best company I've dealt with.",
    dateFr: "Google · il y a une heure",
    dateEn: "Google · 1 hour ago",
  },
  {
    id: "curated-google-2",
    name: "Tarek Sharkawi",
    rating: 5,
    textFr:
      "Je recommande vivement cette entreprise. Louis Philippe a fait preuve d'une meticulosite, d'une efficacite, d'une rigueur et d'un professionnalisme exceptionnels. La qualite de son travail est incomparable. Nous avons fait appel a d'autres entreprises, mais aucune ne peut rivaliser.",
    textEn:
      "I highly recommend this company. Louis Philippe showed exceptional meticulousness, efficiency, rigor and professionalism. The quality of his work is incomparable. We used other companies but none can compete.",
    dateFr: "Google · il y a 8 mois",
    dateEn: "Google · 8 months ago",
  },
  {
    id: "curated-google-3",
    name: "Elodie Grenier-Morin",
    rating: 5,
    textFr:
      "Equipe professionnelle, ponctuelle et tres minutieuse. Le lavage a pression a completement redonne un coup de neuf aux surfaces exterieures et les vitres sont impeccables, sans traces. Le travail est fait avec soin et le resultat depasse les attentes. Je recommande fortement leurs services!",
    textEn:
      "Professional, punctual and very thorough team. Pressure washing completely renewed the exterior surfaces and the windows are impeccable, streak-free. Work done with care and the result exceeds expectations. I strongly recommend their services!",
    dateFr: "Google · il y a une heure",
    dateEn: "Google · 1 hour ago",
  },
  {
    id: "curated-google-4",
    name: "Jack Rothenberg",
    rating: 5,
    textFr:
      "Les personnes avec lesquelles j'ai traite etaient extremement polies et ont tenu parole. Elles sont arrivees a l'heure, ont fait un excellent travail et ont laisse les lieux impeccables. Le prix etait tres raisonnable et je les recommande vivement.",
    textEn:
      "The people I dealt with were extremely polite and kept their word. They arrived on time, did excellent work and left the place spotless. The price was very reasonable and I highly recommend them.",
    dateFr: "Google · il y a 7 mois",
    dateEn: "Google · 7 months ago",
  },
  {
    id: "curated-google-5",
    name: "Caroline Hetu",
    rating: 5,
    textFr:
      "Service impeccable! Je vous recommande sans aucune hesitation cette compagnie. Courtoisie, professionnalisme et a l'ecoute du client. Un merci particulier a Luca pour son devouement. Tres travaillant! Nova Net offre un excellent service.",
    textEn:
      "Impeccable service! I recommend this company without hesitation. Courtesy, professionalism and attentiveness to the client. A special thank you to Luca for his dedication. Very hardworking! Nova Net offers excellent service.",
    dateFr: "Google · il y a 9 mois",
    dateEn: "Google · 9 months ago",
  },
  {
    id: "curated-google-6",
    name: "Donna Wedin",
    rating: 5,
    textFr:
      "Novanet a fait un travail formidable en nettoyant notre allee et les paves de notre cour avant, puis en les remplissant de sable polymere. Luca et son equipe sont jeunes, mais extremement professionnels et consciencieux.",
    textEn:
      "Novanet did a great job cleaning our driveway and front yard paving stones, then filling them with polymer sand. Luca and his team are young but extremely professional and conscientious.",
    dateFr: "Google · il y a 8 mois",
    dateEn: "Google · 8 months ago",
  },
  {
    id: "curated-google-7",
    name: "Brigid Scullion",
    rating: 5,
    textFr:
      "J'ai recemment fait nettoyer mes fenetres par Luca dans un immeuble de la rue Victoria a Westmount, et je suis absolument ravie du resultat! Luca a ete professionnel et meticuleux, et les fenetres sont impeccables. Je recommande vivement ses services!",
    textEn:
      "I recently had my windows cleaned by Luca at a building on Victoria Street in Westmount. Absolutely delighted with the result! Luca was professional and meticulous. I highly recommend his services!",
    dateFr: "Google · il y a un an",
    dateEn: "Google · 1 year ago",
  },
  {
    id: "curated-google-8",
    name: "teanoosh zadeh",
    rating: 5,
    textFr:
      "J'ai fait appel a cette entreprise pour la premiere fois et j'en suis absolument ravie. Ils ont ete tres professionnels et efficaces. Mes fenetres, tant exterieures qu'interieures, ont ete nettoyees.",
    textEn:
      "I used this company for the first time and I am absolutely delighted. They were very professional and efficient. My windows, both exterior and interior, were cleaned to perfection.",
    dateFr: "Google · il y a 7 mois",
    dateEn: "Google · 7 months ago",
  },
  {
    id: "curated-google-9",
    name: "Dominique Bouchard",
    rating: 5,
    textFr:
      "Ils ont lave les fenetres de notre maison ainsi que celles de nos bureaux avec leur nouvel equipement qui permet d'atteindre les fenetres d'un deuxieme etage sans echelle! Nettoyage et service a la clientele impeccable!",
    textEn:
      "They washed our home and office windows with new equipment that reaches second-floor windows without a ladder! Impeccable cleaning and customer service!",
    dateFr: "Google · il y a 8 mois",
    dateEn: "Google · 8 months ago",
  },
  {
    id: "curated-google-10",
    name: "Louise Lamarre",
    rating: 5,
    textFr:
      "Tres bon nettoyage effectue par l'equipe autant pour les fenetres que pour les patios et terrasses exterieurs. Equipe fort sympathique de jeunes entrepreneurs devoues et travaillants.",
    textEn:
      "Very good cleaning by the team for both windows and outdoor patios and terraces. A very friendly team of dedicated and hardworking young entrepreneurs.",
    dateFr: "Google · il y a un an",
    dateEn: "Google · 1 year ago",
  },
  {
    id: "curated-google-11",
    name: "Frederic Viger",
    rating: 5,
    textFr:
      "Service professionnel. Les fenetres ont jamais ete aussi propres. Les lieux etaient propres apres le travail aussi. Je recommande Nova Net pour le lavage de fenetres. Merci encore.",
    textEn:
      "Professional service. The windows have never been so clean. The place was also clean after the work. I recommend Nova Net for window washing. Thank you again.",
    dateFr: "Google · il y a 8 mois",
    dateEn: "Google · 8 months ago",
  },
  {
    id: "curated-google-12",
    name: "Sophie Morin",
    rating: 5,
    textFr:
      "L'equipe Novanet est respectueuse et offre un excellent service a la clientele. Le pave uni et les fenetres nettoyes a la perfection. Je vous recommande Novanet sans hesitation.",
    textEn:
      "The Novanet team is respectful and offers excellent customer service. Paving stones and windows cleaned to perfection. I recommend Novanet without hesitation.",
    dateFr: "Google · il y a une heure",
    dateEn: "Google · 1 hour ago",
  },
];

export type CuratedLang = "fr" | "en";

export function getCuratedGoogleReviewsForApi(lang: CuratedLang) {
  return curated.map((r) => ({
    id: r.id,
    name: r.name,
    rating: r.rating,
    text: lang === "en" ? r.textEn : r.textFr,
    date: lang === "en" ? r.dateEn : r.dateFr,
    source: "google" as const,
  }));
}

type ApiReviewShape = {
  id: string;
  name: string;
  rating: number;
  text: string;
  jobType?: string;
  date?: string;
  source: "google";
};

/**
 * Places Details ne renvoie qu’un sous-ensemble d’avis ; on complète avec la liste
 * conservée localement jusqu’à `max` entrées (sans doublons évidents).
 */
export function mergeApiGoogleReviewsWithCurated(
  api: ApiReviewShape[],
  lang: CuratedLang,
  max = 50,
): ApiReviewShape[] {
  const extra = getCuratedGoogleReviewsForApi(lang);
  const seen = new Set<string>();
  const out: ApiReviewShape[] = [];
  const key = (r: { name: string; text: string }) =>
    `${r.name.trim().toLowerCase()}|${(r.text ?? "").slice(0, 120)}`;

  for (const r of api) {
    const k = key(r);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(r);
    }
  }
  for (const r of extra) {
    if (out.length >= max) break;
    const k = key(r);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(r);
    }
  }
  return out;
}
