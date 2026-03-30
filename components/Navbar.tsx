"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import HiringDialog from "./HiringDialog";
import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const navRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isHiringDialogOpen, setIsHiringDialogOpen] = useState(false);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const height = navRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${height}px`,
      );
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    updateNavbarHeight();
    handleScroll();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateNavbarHeight())
        : null;

    if (navRef.current && resizeObserver) {
      resizeObserver.observe(navRef.current);
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  const toggleLang = () => {
    setLang(lang === "fr" ? "en" : "fr");
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-md transition-[box-shadow,background-color] md:px-10 ${
        scrolled ? "shadow-sm bg-white/85" : ""
      }`}
    >
      <div className="flex min-w-0 shrink-0 items-center">
        <Link href="/" className="flex items-center gap-2 py-1">
          <NavbarLogo />
        </Link>
      </div>

      {isHomePage ? (
        <div className="absolute left-1/2 top-1/2 hidden w-auto max-w-[55vw] -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:gap-10 md:flex">
          <a
            href="#services"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-[#0f1f4b]"
          >
            {t("services")}
          </a>
          <a
            href="#resultats"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-[#0f1f4b]"
          >
            {t("results")}
          </a>
          <button
            type="button"
            onClick={() => setIsHiringDialogOpen(true)}
            className="text-sm font-medium text-[#0f1f4b] hover:underline"
          >
            {t("hiring")}
          </button>
        </div>
      ) : null}

      <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleLang}
          className="rounded-sm border border-slate-300/90 bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-[#0f1f4b] hover:text-[#0f1f4b]"
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>
        {isHomePage ? (
          <a href="#contact" className="btn-institutional-nav whitespace-nowrap">
            {t("quote")}
          </a>
        ) : (
          <Link
            href="/#contact"
            className="btn-institutional-nav whitespace-nowrap"
          >
            {t("quote")}
          </Link>
        )}
      </div>

      <HiringDialog
        isOpen={isHiringDialogOpen}
        onClose={() => setIsHiringDialogOpen(false)}
      />
    </nav>
  );
}
