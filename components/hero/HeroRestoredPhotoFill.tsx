import { HERO_RESTORED_BACKGROUND_IMAGE_URL } from "@/components/hero/heroRestoredBackgroundUrl";

type Props = {
  /** Accessible label (replaces former <Image alt>). */
  alt: string;
  /** Tailwind classes for `background-size` / `background-position` / opacity, etc. */
  className?: string;
};

/**
 * Full-bleed hero photo using the restored inline asset from the static site
 * (`novanet_site-32.html` `.hbg`).
 */
export function HeroRestoredPhotoFill({ alt, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`absolute inset-0 bg-cover bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url("${HERO_RESTORED_BACKGROUND_IMAGE_URL}")`,
        transform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    />
  );
}
