"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import HiringDialog from "./HiringDialog";

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
      setScrolled(window.scrollY > 20);
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
      className={`fixed top-0 left-0 right-0 z-50 bg-white h-16 flex items-center px-8 md:px-16 border-b border-gray-100 transition-shadow ${
        isHomePage ? "justify-between" : "justify-between"
      } ${scrolled ? "shadow-sm" : ""}`}
    >
      <div className="flex items-center">
        <Link
          href="/"
          className="text-xl font-bold text-[#0f1f4b] tracking-tight"
        >
          Nova Net
        </Link>
      </div>
      {isHomePage && (
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="#services"
            className="text-sm font-medium text-gray-700 hover:text-[#2563eb] transition-colors"
          >
            {t("services")}
          </Link>
          <Link
            href="#resultats"
            className="text-sm font-medium text-gray-700 hover:text-[#2563eb] transition-colors"
          >
            {t("results")}
          </Link>
          <button
            onClick={() => setIsHiringDialogOpen(true)}
            className="text-sm font-medium text-[#2563eb] hover:underline"
          >
            {t("hiring")}
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="text-xs font-medium px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>
        <Link
          href={isHomePage ? "#contact" : "/#contact"}
          className="text-sm font-semibold px-5 py-2 rounded bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors"
        >
          {t("quote")}
        </Link>
      </div>
      <HiringDialog
        isOpen={isHiringDialogOpen}
        onClose={() => setIsHiringDialogOpen(false)}
      />
    </nav>
  );
}
