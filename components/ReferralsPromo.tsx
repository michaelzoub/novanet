"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ReferralsPromo() {
  const { lang } = useLanguage();

  const copy =
    lang === "fr"
      ? {
          eyebrow: "Programme de Référence",
          title: "GAGNEZ EN\nRECOMMANDANT",
          description:
            "Recommandez Novanet à vos proches et obtenez une récompense à chaque nouveau client que vous nous envoyez. Simple, rapide et avantageux.",
          steps: [
            {
              number: "01",
              title: "Créez votre lien",
              description: "Inscrivez votre nom et obtenez un lien de référence unique.",
            },
            {
              number: "02",
              title: "Partagez",
              description: "Envoyez votre lien à vos amis, famille ou collègues.",
            },
            {
              number: "03",
              title: "Récoltez vos gains",
              description: "Recevez une récompense pour chaque client référé qui utilise nos services.",
            },
          ],
          cta: "Rejoindre le programme",
        }
      : {
          eyebrow: "Referral Program",
          title: "EARN BY\nREFERRING",
          description:
            "Refer Novanet to friends and earn a reward for every new client you send our way. Simple, fast, and worth it.",
          steps: [
            {
              number: "01",
              title: "Create your link",
              description: "Enter your name and get a unique referral link.",
            },
            {
              number: "02",
              title: "Share it",
              description: "Send your link to friends, family, or neighbours.",
            },
            {
              number: "03",
              title: "Collect rewards",
              description: "Receive a reward for every referred client who books our services.",
            },
          ],
          cta: "Join the program",
        };

  return (
    <section id="referrals" className="border-t border-gray-100 bg-white py-20">
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center bg-blue-50 text-[#2563eb]">
              <Gift size={20} />
            </div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2563eb]">
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] text-[#0f1f4b] md:text-5xl whitespace-pre-line">
              {copy.title}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-gray-600">
              {copy.description}
            </p>
            <Link
              href="/referrals"
              className="mt-8 inline-block bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              {copy.cta}
            </Link>
          </div>

          <div className="mt-12 space-y-6 lg:mt-0">
            {copy.steps.map((step) => (
              <div key={step.number} className="flex gap-5 border border-gray-100 bg-[#f8fafc] p-6">
                <div className="font-display text-3xl font-bold leading-none text-[#e5e7eb] shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold uppercase text-[#0f1f4b]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
