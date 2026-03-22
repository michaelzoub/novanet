import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Nova Net – Lavage Extérieur",
  description: "Service professionnel de lavage extérieur haute performance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen overflow-hidden bg-white text-slate-900 antialiased">
        <LanguageProvider>
          <ScrollArea className="h-screen">
            <Navbar />
            <div className="pt-[var(--navbar-height,64px)]">{children}</div>
          </ScrollArea>
        </LanguageProvider>
      </body>
    </html>
  );
}
