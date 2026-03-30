"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

/**
 * Atténue le « flash » au premier rendu (navbar, polices, hydration) par une entrée douce.
 */
export default function HomePagePresence({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <AnimatePresence mode="sync">
      <motion.main
        key="home-landing"
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.42, ease: easeOutExpo }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
