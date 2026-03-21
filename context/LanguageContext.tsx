"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Language = "fr" | "en";

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

    // Hiring Dialog
    "hiring.title": "Postuler chez Nova Net",
    "hiring.description":
      "Rejoignez notre équipe! Remplissez le formulaire ci-dessous et téléversez votre CV.",
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
      "Offre de parrainage active: la personne qui vous a refere et vous obtenez chacun 20 % une fois ce formulaire complete.",
    "referrals.eyebrow": "Programme de parrainage",
    "referrals.title": "Creez votre lien et offrez 20 % a vos proches.",
    "referrals.description":
      "Quand une personne utilise votre lien, arrive sur l'accueil et complete le formulaire de contact, vous obtenez chacun 20 % et votre compteur augmente de 1.",
    "referrals.createTitle": "Generer un lien",
    "referrals.createDescription":
      "Entrez votre nom complet pour obtenir un lien unique.",
    "referrals.fullName": "Nom complet",
    "referrals.createError": "Impossible de creer votre lien de parrainage.",
    "referrals.createSubmitting": "Creation en cours...",
    "referrals.createSubmit": "Creer mon lien",
    "referrals.lookupTitle": "Verifier un parrainage",
    "referrals.lookupDescription":
      "Entrez votre nom complet pour retrouver votre lien et votre compteur.",
    "referrals.lookupError": "Impossible de retrouver ce profil de parrainage.",
    "referrals.lookupSubmitting": "Verification...",
    "referrals.lookupSubmit": "Verifier mon lien",
    "referrals.howItWorks": "Fonctionnement",
    "referrals.step1": "1. Vous creez un lien personnel avec votre prenom.",
    "referrals.step2":
      "2. Votre proche arrive sur la page d'accueil via ce lien.",
    "referrals.step3":
      "3. Le parrainage compte seulement apres le formulaire de contact complete.",
    "referrals.step4":
      "4. Le referrer et la personne referee obtiennent chacun 20 %.",
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

    // Hiring Dialog
    "hiring.title": "Apply to Nova Net",
    "hiring.description":
      "Join our team! Fill out the form below and upload your CV.",
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  useEffect(() => {
    const storedLang = window.localStorage.getItem("novanet-lang");
    if (storedLang === "fr" || storedLang === "en") {
      setLang(storedLang);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("novanet-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang][key as keyof typeof translations.fr] || key;
  };

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
