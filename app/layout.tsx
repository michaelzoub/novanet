import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import { Outfit } from "next/font/google";

/** Single cohesive stack: geometric, legible, works for institutional CTAs and headlines. */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon.svg",
  },
  title: {
    default:
      "Nova Net — Lavage extérieur professionnel | Grand Montréal",
    template: "%s | Nova Net",
  },
  description:
    "Nova Net offre lavage de vitres, lavage à pression, scellant de pavés et sablage pour résidences et entreprises dans la région du Grand Montréal. Soumission gratuite, service rapide et résultats durables.",
  keywords: [
    "lavage extérieur Montréal",
    "lavage à pression",
    "lavage de vitres",
    "scellant de pavés",
    "Nova Net",
    "Grand Montréal",
    "Laval",
    "Longueuil",
  ],
  authors: [{ name: "Nova Net" }],
  creator: "Nova Net",
  publisher: "Nova Net",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: siteUrl,
    siteName: "Nova Net",
    title: "Nova Net — Lavage extérieur professionnel | Grand Montréal",
    description:
      "Lavage de vitres, pression, pavés et sablage sur le Grand Montréal. Faites une demande de soumission gratuite.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova Net — Lavage extérieur professionnel",
    description:
      "Services de nettoyage extérieur haute performance dans la région de Montréal.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookieLang = cookies().get("novanet-lang")?.value;
  const initialLang =
    cookieLang === "en" || cookieLang === "fr" ? cookieLang : "fr";

  return (
    <html
      lang={initialLang}
      className={`scroll-smooth ${outfit.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased">
        <LanguageProvider initialLang={initialLang}>
          <Navbar />
          <div className="pt-[var(--navbar-height,64px)]">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
