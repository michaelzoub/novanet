"use client";

/** Fichier dans /public — espaces encodés pour l’URL. */
const LOGO_SRC = "/novanet.png";

export default function NavbarLogo() {
  return (
    <span className="relative inline-block h-[46px] w-[166px] shrink-0 min-[380px]:h-[50px] min-[380px]:w-[182px] sm:h-[54px] sm:w-[200px] md:h-[58px] md:w-[230px]">
      <img
        src={LOGO_SRC}
        alt="Nova Net"
        width={550}
        height={200}
        decoding="async"
        fetchPriority="high"
        className="h-full w-full object-contain object-left"
      />
    </span>
  );
}
