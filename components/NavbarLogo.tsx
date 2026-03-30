"use client";

/** Fichier dans /public — espaces encodés pour l’URL. */
const LOGO_SRC =
  "/novanet.png";

export default function NavbarLogo() {
  return (
    <span className="relative inline-block h-[44px] w-[158px] shrink-0 min-[380px]:h-[48px] min-[380px]:w-[176px] sm:h-[52px] sm:w-[196px] md:h-[58px] md:w-[236px]">
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
