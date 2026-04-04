"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import HiringDialog from "./HiringDialog";
import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const navRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isHiringDialogOpen, setIsHiringDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const height = navRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty("--navbar-height", `${height}px`);
    };
    const handleScroll = () => setScrolled(window.scrollY > 12);

    updateNavbarHeight();
    handleScroll();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateNavbarHeight())
        : null;
    if (navRef.current && resizeObserver) resizeObserver.observe(navRef.current);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateNavbarHeight);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");

  const navLinks = isHomePage
    ? [
        { label: t("about"), href: "#about" },
        { label: t("services"), href: "#services" },
        { label: t("portfolio"), href: "#resultats" },
        { label: t("contact"), href: "#contact" },
      ]
    : [];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 flex h-[64px] items-center border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-md transition-[box-shadow,background-color] md:h-[70px] md:px-10 ${
          scrolled ? "shadow-sm bg-white/85" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link href="/" className="flex items-center py-1" onClick={() => setMenuOpen(false)}>
            <NavbarLogo />
          </Link>
        </div>

        {/* Desktop nav — centred */}
        {isHomePage && (
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-1 md:flex lg:gap-x-7">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-[#0f1f4b]"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setIsHiringDialogOpen(true)}
              className="text-sm font-semibold text-[#0f766e] transition-colors hover:text-[#0d9488] hover:underline"
            >
              {t("hiring")}
            </button>
          </div>
        )}

        <div className="flex-1" />

        {/* Right group */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Lang toggle */}
          <button
            type="button"
            onClick={toggleLang}
            className="shrink-0 rounded-sm border border-slate-300/90 bg-white/90 px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-[#0f1f4b] hover:text-[#0f1f4b] sm:px-3"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>

          {/* CTA */}
          {isHomePage ? (
            <a
              href="#contact"
              className="btn-institutional-nav !px-2.5 !py-2 !text-[9px] !tracking-[0.1em] sm:!px-4 sm:!py-2.5 sm:!text-[10px] sm:!tracking-[0.16em]"
            >
              <span className="sm:hidden">{lang === "fr" ? "Devis" : "Quote"}</span>
              <span className="hidden sm:inline">{t("quote")}</span>
            </a>
          ) : (
            <Link
              href="/#contact"
              className="btn-institutional-nav !px-2.5 !py-2 !text-[9px] !tracking-[0.1em] sm:!px-4 sm:!py-2.5 sm:!text-[10px] sm:!tracking-[0.16em]"
            >
              <span className="sm:hidden">{lang === "fr" ? "Devis" : "Quote"}</span>
              <span className="hidden sm:inline">{t("quote")}</span>
            </Link>
          )}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#0f1f4b] hover:text-[#0f1f4b] md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen} modal={true}>
        <SheetContent side="left" className="flex flex-col p-0 pt-0">
          <SheetHeader className="border-b border-slate-100 px-6 py-5">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <NavbarLogo />
          </SheetHeader>

          <nav className="flex flex-col flex-1 py-3">
            {navLinks.map((l) => (
              <SheetClose key={l.href} asChild>
                <a
                  href={l.href}
                  className="px-6 py-4 text-[15px] font-medium text-slate-800 transition-colors hover:bg-slate-50 hover:text-[#0f1f4b] border-b border-slate-100 last:border-0"
                >
                  {l.label}
                </a>
              </SheetClose>
            ))}
            <SheetClose asChild>
              <button
                type="button"
                onClick={() => setIsHiringDialogOpen(true)}
                className="px-6 py-4 text-left text-[15px] font-semibold text-[#0f766e] transition-colors hover:bg-slate-50 border-b border-slate-100"
              >
                {t("hiring")}
              </button>
            </SheetClose>
          </nav>

          {/* Bottom CTA */}
          <div className="p-6 border-t border-slate-100">
            <SheetClose asChild>
              {isHomePage ? (
                <a
                  href="#contact"
                  className="btn-institutional-primary block w-full text-center py-3"
                >
                  {t("quote")}
                </a>
              ) : (
                <Link
                  href="/#contact"
                  className="btn-institutional-primary block w-full text-center py-3"
                >
                  {t("quote")}
                </Link>
              )}
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      <HiringDialog
        isOpen={isHiringDialogOpen}
        onClose={() => setIsHiringDialogOpen(false)}
      />
    </>
  );
}
