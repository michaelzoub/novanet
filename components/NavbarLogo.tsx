"use client";

/** Fichier dans /public — espaces encodés pour l’URL. */
const LOGO_SRC =
  "/novanet.png";

export default function NavbarLogo() {
  return (
    <span className="relative inline-block h-[52px] w-[196px] shrink-0 sm:h-[58px] sm:w-[236px]">
      <img
        src={LOGO_SRC}
        alt="Nova Net"
        width={340}
        height={104}
        decoding="async"
        fetchPriority="high"
        className="h-full w-full object-contain object-left"
      />
    </span>
  );
}
