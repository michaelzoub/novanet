"use client";

const LOGO_SRC = "/Nova%20Net%20-%20Logo.jpg";

/** Logo en <img> natif — évite les soucis d’affichage avec `next/image` (domaine, optim, etc.). */
export default function NavbarLogo() {
  return (
    <span className="relative inline-block h-12 w-[176px] shrink-0 sm:h-[52px] sm:w-[212px]">
      <img
        src={LOGO_SRC}
        alt="Nova Net"
        width={340}
        height={104}
        decoding="async"
        fetchPriority="high"
        className="h-full w-full object-contain object-left mix-blend-multiply"
      />
    </span>
  );
}
