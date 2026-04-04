"use client";

import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  LANDING_EASE,
  LANDING_REVEAL_DURATION,
  LANDING_STAGGER_CHILD,
  LANDING_STAGGER_DELAY,
  LANDING_VIEWPORT,
} from "@/lib/landing-motion";

export default function ReferralsPromo() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const copy =
    lang === "fr"
      ? {
          eyebrow: "Programme de Référence",
          title: "GAGNEZ EN\nRECOMMANDANT",
          description:
            "Recommandez Nova Net à vos proches et obtenez une récompense à chaque nouveau client que vous nous envoyez. Simple, rapide et avantageux.",
          steps: [
            {
              number: "01",
              title: "Créez votre lien",
              description:
                "Inscrivez votre nom et obtenez un lien de référence unique.",
            },
            {
              number: "02",
              title: "Partagez",
              description:
                "Envoyez votre lien à vos amis, famille ou collègues.",
            },
            {
              number: "03",
              title: "Récoltez vos gains",
              description:
                "Recevez une récompense pour chaque client référé qui utilise nos services.",
            },
          ],
          cta: "Rejoindre le programme",
        }
      : {
          eyebrow: "Referral Program",
          title: "EARN BY\nREFERRING",
          description:
            "Refer Nova Net to friends and earn a reward for every new client you send our way. Simple, fast, and worth it.",
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
              description:
                "Receive a reward for every referred client who books our services.",
            },
          ],
          cta: "Join the program",
        };

  const fadeUp = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 1, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: LANDING_REVEAL_DURATION, ease: LANDING_EASE },
        },
      };

  const staggerLeft = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : LANDING_STAGGER_CHILD,
        delayChildren: reduceMotion ? 0 : LANDING_STAGGER_DELAY,
      },
    },
  };

  const staggerSteps = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : LANDING_STAGGER_CHILD,
        delayChildren: reduceMotion ? 0 : LANDING_STAGGER_DELAY * 2,
      },
    },
  };

  const stepVariant = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 1, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: LANDING_REVEAL_DURATION, ease: LANDING_EASE },
        },
      };

  const cardReveal = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 1, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: LANDING_REVEAL_DURATION, ease: LANDING_EASE },
        },
      };

  return (
    <section
      id="referrals"
      className="border-t border-[#0f1f4b]/[0.06] bg-gradient-to-b from-[#eef1f8] via-[#f6f7fb] to-white py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <motion.div
          className="relative overflow-hidden rounded-sm border border-[#0f1f4b]/10 bg-white/95 p-10 shadow-[0_24px_60px_-18px_rgba(15,31,75,0.14)] ring-1 ring-[#0f1f4b]/[0.04] md:p-12 lg:px-14 lg:py-16"
          initial="hidden"
          whileInView="visible"
          viewport={LANDING_VIEWPORT}
          variants={cardReveal}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#0f1f4b]/[0.04] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#0f1f4b]/[0.05] blur-2xl"
            aria-hidden
          />

          <div className="relative lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              className="min-w-0"
              initial="hidden"
              whileInView="visible"
              viewport={LANDING_VIEWPORT}
              variants={staggerLeft}
            >
              <motion.div
                variants={fadeUp}
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-to-br from-[#0f1f4b]/10 to-[#0f1f4b]/5 text-[#0f1f4b] shadow-inner ring-1 ring-[#0f1f4b]/10"
              >
                <Gift size={22} strokeWidth={1.75} />
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f1f4b]"
              >
                {copy.eyebrow}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="font-display text-balance break-words text-3xl font-bold uppercase leading-[0.95] text-[#0f1f4b] sm:text-4xl md:text-5xl whitespace-pre-line"
              >
                {copy.title}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-lg text-[15px] leading-relaxed text-gray-600"
              >
                {copy.description}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-9">
                <Link
                  href="/referrals"
                  className="group btn-institutional-primary inline-flex items-center gap-2.5 shadow-md shadow-[#0f1f4b]/20 hover:!border-[#0f1f4b] hover:!bg-[#0f1f4b]"
                >
                  {copy.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-12 space-y-4 lg:mt-0"
              initial="hidden"
              whileInView="visible"
              viewport={LANDING_VIEWPORT}
              variants={staggerSteps}
            >
              {copy.steps.map((step) => (
                <motion.div
                  key={step.number}
                  variants={stepVariant}
                  className="group flex min-w-0 gap-5 rounded-sm border border-gray-200/90 bg-gradient-to-br from-[#f8fafc] to-white p-6 shadow-sm transition-all duration-300 hover:border-[#0f1f4b]/25 hover:shadow-md hover:shadow-[#0f1f4b]/[0.06] sm:gap-6 sm:p-7 md:p-8"
                >
                  <div className="shrink-0 font-display text-2xl font-bold leading-none text-[#d1d5db] transition-colors duration-300 group-hover:text-[#0f1f4b]/25 sm:text-3xl">
                    {step.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-display text-sm font-bold uppercase text-[#0f1f4b] sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
