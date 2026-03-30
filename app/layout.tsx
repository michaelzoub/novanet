import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Nova Net – Lavage Extérieur",
  description: "Service professionnel de lavage extérieur haute performance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased">
        <LanguageProvider>
          <Navbar />
          <div className="pt-[var(--navbar-height,64px)]">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
