"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

  /* Lock body scroll when menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");
  const close = () => setMenuOpen(false);

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
        className={`fixed top-0 left-0 right-0 z-50 flex min-h-[64px] items-center border-b border-slate-200/60 bg-white/70 px-4 py-2 backdrop-blur-md transition-[box-shadow,background-color] md:min-h-[70px] md:px-10 ${
          scrolled ? "shadow-sm bg-white/85" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link href="/" className="flex items-center" onClick={close}>
            <NavbarLogo />
          </Link>
        </div>

        {/* Desktop nav — centred */}
        {isHomePage && (
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-1 md:flex lg:gap-x-7">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-slate-700 transition-colors hover:text-[#0f1f4b]">
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
          <button
            type="button"
            onClick={toggleLang}
            className="shrink-0 rounded-sm border border-slate-300/90 bg-white/90 px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-[#0f1f4b] hover:text-[#0f1f4b] sm:px-3"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>

          {isHomePage ? (
            <a href="#contact" className="btn-institutional-nav !px-2.5 !py-2 !text-[9px] !tracking-[0.1em] sm:!px-4 sm:!py-2.5 sm:!text-[10px] sm:!tracking-[0.16em]">
              <span className="sm:hidden">{lang === "fr" ? "Devis" : "Quote"}</span>
              <span className="hidden sm:inline">{t("quote")}</span>
            </a>
          ) : (
            <Link href="/#contact" className="btn-institutional-nav !px-2.5 !py-2 !text-[9px] !tracking-[0.1em] sm:!px-4 sm:!py-2.5 sm:!text-[10px] sm:!tracking-[0.16em]">
              <span className="sm:hidden">{lang === "fr" ? "Devis" : "Quote"}</span>
              <span className="hidden sm:inline">{t("quote")}</span>
            </Link>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Fermer" : "Menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#0f1f4b] hover:text-[#0f1f4b] md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* ── Custom mobile drawer — no Radix Portal, no dvh issues ── */}
      {/* Backdrop */}
      <div
        onClick={close}
        className="md:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.35)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "78%",
          maxWidth: "320px",
          zIndex: 50,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: menuOpen ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: "1px solid #f1f5f9", padding: "20px 24px", flexShrink: 0 }}>
          <NavbarLogo />
        </div>

        {/* Links */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" as never }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              style={{
                display: "flex",
                padding: "18px 24px",
                fontSize: "15px",
                fontWeight: 500,
                color: "#1e293b",
                borderBottom: "1px solid #f1f5f9",
                textDecoration: "none",
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => { close(); setIsHiringDialogOpen(true); }}
            style={{
              display: "flex",
              width: "100%",
              padding: "18px 24px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#0f766e",
              borderBottom: "1px solid #f1f5f9",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: "1px solid #f1f5f9",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {t("hiring")}
          </button>
        </div>

        {/* CTA pinned at bottom */}
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "20px 24px", flexShrink: 0 }}>
          {isHomePage ? (
            <a
              href="#contact"
              onClick={close}
              className="btn-institutional-primary block w-full text-center py-3"
            >
              {t("quote")}
            </a>
          ) : (
            <Link
              href="/#contact"
              onClick={close}
              className="btn-institutional-primary block w-full text-center py-3"
            >
              {t("quote")}
            </Link>
          )}
        </div>
      </div>

      <HiringDialog
        isOpen={isHiringDialogOpen}
        onClose={() => setIsHiringDialogOpen(false)}
      />
    </>
  );
}
