"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  ReactNode,
} from "react";

type Language = "fr" | "en";

const LANG_COOKIE = "novanet-lang";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
  fr: {
    // Navbar
    hiring: "On embauche",
    quote: "Soumission gratuite",
    services: "Services",
    results: "Résultats",
    refer: "Parrainer",

    // Hiring Dialog
    "hiring.title": "Postuler chez Nova Net",
    "hiring.description":
      "Rejoignez notre équipe ! Remplissez le formulaire ci-dessous et téléversez votre CV.",
    "hiring.whyJoin": "Pourquoi nous rejoindre ?",
    "hiring.whyJoinHint": "afficher",
    "hiring.whyJoin1": "Compétences en vente et en communication",
    "hiring.whyJoin2": "Rémunération à la commission",
    "hiring.whyJoin3": "Les meilleurs peuvent gagner plus de 1 000 $ par semaine",
    "hiring.whyJoin4": "Primes de performance offertes",
    "hiring.firstName": "Prénom",
    "hiring.lastName": "Nom",
    "hiring.email": "Email",
    "hiring.phone": "Téléphone",
    "hiring.cv": "CV (PDF ou Word)",
    "hiring.cvUpload": "Cliquez pour téléverser votre CV",
    "hiring.cvChange": "Cliquez pour changer de fichier",
    "hiring.cvMaxSize": "PDF ou Word (max 5MB)",
    "hiring.message": "Message (optionnel)",
    "hiring.messagePlaceholder":
      "Parlez-nous de vous et de votre expérience...",
    "hiring.cancel": "Annuler",
    "hiring.submit": "Envoyer la candidature",
    "hiring.submitting": "Envoi en cours...",
    "hiring.success": "Votre candidature a été envoyée avec succès!",
    "hiring.error": "Une erreur est survenue. Veuillez réessayer.",
    "hiring.cvRequired": "Veuillez téléverser votre CV.",
    "hiring.cvTooLarge":
      "Le fichier CV est trop volumineux. Taille maximale: 5MB",
    "hiring.cvInvalidFormat":
      "Format de fichier non supporté. Veuillez utiliser PDF ou Word.",
    "hiring.fileReadError": "Erreur lors de la lecture du fichier.",
    "contact.referralActive":
      "Offre de parrainage active : vous et la personne qui vous a référé obtenez chacun 20 % une fois ce formulaire complété.",
    "referrals.eyebrow": "Programme de parrainage",
    "referrals.title": "Créez votre lien et offrez 20 % à vos proches.",
    "referrals.description":
      "Lorsqu'une personne utilise votre lien, arrive sur l'accueil et complète le formulaire de contact, vous obtenez chacun 20 % et votre compteur augmente de 1.",
    "referrals.createTitle": "Générer un lien",
    "referrals.createDescription":
      "Entrez votre nom complet pour obtenir un lien unique.",
    "referrals.fullName": "Nom complet",
    "referrals.createError": "Impossible de créer votre lien de parrainage.",
    "referrals.createSubmitting": "Création en cours…",
    "referrals.createSubmit": "Créer mon lien",
    "referrals.lookupTitle": "Vérifier un parrainage",
    "referrals.lookupDescription":
      "Entrez votre nom complet pour retrouver votre lien et votre compteur.",
    "referrals.lookupError": "Impossible de retrouver ce profil de parrainage.",
    "referrals.lookupSubmitting": "Vérification…",
    "referrals.lookupSubmit": "Vérifier mon lien",
    "referrals.howItWorks": "Fonctionnement",
    "referrals.step1": "1. Vous créez un lien personnel avec votre prénom.",
    "referrals.step2":
      "2. Votre proche arrive sur la page d'accueil via ce lien.",
    "referrals.step3":
      "3. Le parrainage compte seulement après le formulaire de contact complété.",
    "referrals.step4":
      "4. Le parrain et la personne parrainée obtiennent chacun 20 %.",
    "referrals.yourLink": "Votre lien",
    "referrals.code": "Code",
    "referrals.count": "Parrainages qualifies",
  },
  en: {
    // Navbar
    hiring: "We're hiring",
    quote: "Free Quote",
    services: "Services",
    results: "Results",
    refer: "Refer",

    // Hiring Dialog
    "hiring.title": "Apply to Nova Net",
    "hiring.description":
      "Join our team! Fill out the form below and upload your CV.",
    "hiring.whyJoin": "Why join us",
    "hiring.whyJoinHint": "show",
    "hiring.whyJoin1": "Sales and communication skills",
    "hiring.whyJoin2": "Commission-based pay",
    "hiring.whyJoin3": "Top performers earn $1,000+/week",
    "hiring.whyJoin4": "Performance bonuses available",
    "hiring.firstName": "First Name",
    "hiring.lastName": "Last Name",
    "hiring.email": "Email",
    "hiring.phone": "Phone",
    "hiring.cv": "CV (PDF or Word)",
    "hiring.cvUpload": "Click to upload your CV",
    "hiring.cvChange": "Click to change file",
    "hiring.cvMaxSize": "PDF or Word (max 5MB)",
    "hiring.message": "Message (optional)",
    "hiring.messagePlaceholder":
      "Tell us about yourself and your experience...",
    "hiring.cancel": "Cancel",
    "hiring.submit": "Submit Application",
    "hiring.submitting": "Submitting...",
    "hiring.success": "Your application has been sent successfully!",
    "hiring.error": "An error occurred. Please try again.",
    "hiring.cvRequired": "Please upload your CV.",
    "hiring.cvTooLarge": "CV file is too large. Maximum size: 5MB",
    "hiring.cvInvalidFormat":
      "File format not supported. Please use PDF or Word.",
    "hiring.fileReadError": "Error reading file.",
    "contact.referralActive":
      "Referral offer active: the person who referred you and you both get 20% once this contact form is completed.",
    "referrals.eyebrow": "Referral program",
    "referrals.title": "Create your link and give 20% to your contacts.",
    "referrals.description":
      "When someone uses your link, lands on the homepage, and completes the contact form, you both get 20% and your counter increases by 1.",
    "referrals.createTitle": "Generate a link",
    "referrals.createDescription":
      "Enter your full name to get a unique referral link.",
    "referrals.fullName": "Full name",
    "referrals.createError": "Unable to create your referral link.",
    "referrals.createSubmitting": "Creating...",
    "referrals.createSubmit": "Create my link",
    "referrals.lookupTitle": "Check a referral",
    "referrals.lookupDescription":
      "Enter your full name to retrieve your link and counter.",
    "referrals.lookupError": "Unable to find that referral profile.",
    "referrals.lookupSubmitting": "Checking...",
    "referrals.lookupSubmit": "Check my link",
    "referrals.howItWorks": "How it works",
    "referrals.step1": "1. You create a personal link with your first name.",
    "referrals.step2":
      "2. Your contact lands on the homepage through that link.",
    "referrals.step3":
      "3. The referral only counts after the homepage contact form is completed.",
    "referrals.step4": "4. The referrer and referred customer each get 20%.",
    "referrals.yourLink": "Your link",
    "referrals.code": "Code",
    "referrals.count": "Qualified referrals",
  },
};

function persistLang(lang: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem("novanet-lang", lang);
  } catch {
    /* ignore */
  }
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);

  /**
   * Cookie + server `initialLang` are the source of truth for the first paint.
   * Align localStorage to match so we never flip language after hydration (no EN↔FR flash).
   */
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("novanet-lang");
      if (stored === "en" || stored === "fr") {
        if (stored !== initialLang) {
          localStorage.setItem("novanet-lang", initialLang);
        }
      } else {
        localStorage.setItem("novanet-lang", initialLang);
      }
      document.documentElement.lang = initialLang;
    } catch {
      document.documentElement.lang = initialLang;
    }
  }, [initialLang]);

  useEffect(() => {
    persistLang(lang);
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key as keyof typeof translations.fr] || key;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
