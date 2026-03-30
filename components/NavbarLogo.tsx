"use client";

/** Nom de fichier sans espaces — évite les 404 / encodage différent selon les CDN. */
const LOGO_SRC = "/nova-net-logo.jpg";

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
        className="h-full w-full object-contain object-left"
      />
    </span>
  );
}
