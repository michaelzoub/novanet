"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const CDN_BASE = (process.env.NEXT_PUBLIC_ASSET_CDN ?? "").replace(/\/$/, "");
const assetUrl = (path: string) => (CDN_BASE ? `${CDN_BASE}${path}` : path);

type TeamSlide = {
  jpeg: string;
  outBase: string;
  altFr: string;
  altEn: string;
  /** Tailwind object-* for focal point */
  objectPosition: string;
};

const TEAM_SLIDES: TeamSlide[] = [
  {
    jpeg: "/about-team.jpg",
    outBase: "about-team",
    altFr: "Luca et Louis-Philippe, fondateurs de Nova Net",
    altEn: "Luca and Louis-Philippe, Nova Net founders",
    objectPosition: "object-top",
  },
  {
    jpeg: "/working2.jpeg",
    outBase: "working2",
    altFr: "Lavage de vitres en cours",
    altEn: "Window washing in progress",
    objectPosition: "object-center",
  },
  {
    jpeg: "/working3.jpeg",
    outBase: "working3",
    altFr: "Équipe Nova Net devant les fenêtres d'une propriété",
    altEn: "Nova Net team in front of windows",
    objectPosition: "object-center",
  },
  {
    jpeg: "/working4.jpeg",
    outBase: "working4",
    altFr: "Nettoyage extérieur sur le terrain",
    altEn: "Exterior cleaning on site",
    objectPosition: "object-center",
  },
];

function formatResponsiveSrcSet(outBase: string, kind: "avif" | "webp"): string {
  const ext = kind;
  return [640, 960, 1280, 1600]
    .map((w) => `/about/${outBase}-${w}.${ext} ${w}w`)
    .join(", ");
}

export default function About() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [uiReady, setUiReady] = useState(false);
  const currentRef = useRef(current);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const copy =
    lang === "fr"
      ? {
          eyebrow: "À propos",
          title: "Pourquoi nous choisir",
          description:
            "Avec des années d'expérience dans le nettoyage extérieur, nous sommes le partenaire de confiance qu'il vous faut.",
          carouselLabel: "Photos de l'équipe",
          values: [
            {
              title: "Qualité professionnelle",
              description:
                "Nous utilisons des équipements et des produits de grande qualité pour garantir des résultats durables.",
            },
            {
              title: "Service rapide",
              description:
                "Notre équipe expérimentée travaille efficacement sans compromettre la qualité.",
            },
            {
              title: "Satisfaction garantie",
              description:
                "Votre satisfaction est notre priorité jusqu'à la fin des travaux.",
            },
          ],
        }
      : {
          eyebrow: "About",
          title: "Why Choose Us",
          description:
            "With years of exterior cleaning experience, we are the partner you can rely on.",
          carouselLabel: "Team photos",
          values: [
            {
              title: "Professional Quality",
              description:
                "We use high-quality equipment and products to deliver lasting results.",
            },
            {
              title: "Fast Service",
              description:
                "Our experienced team works efficiently without compromising quality.",
            },
            {
              title: "Guaranteed Satisfaction",
              description:
                "Your satisfaction stays our priority until the job is done right.",
            },
          ],
        };

  const firstPreload = `/about/${TEAM_SLIDES[0].outBase}-1280.webp`;
  const fadeMs = reduceMotion ? 120 : 450;

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setUiReady(true);
    };
    img.onerror = () => {
      /* fallback JPEG still visible below */
      if (!cancelled) setUiReady(true);
    };
    img.src = assetUrl(firstPreload);
    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = useCallback((idx: number) => {
    const n = TEAM_SLIDES.length;
    setCurrent(((idx % n) + n) % n);
  }, []);

  const next = useCallback(() => {
    goTo(currentRef.current + 1);
  }, [goTo]);

  const prev = useCallback(() => {
    goTo(currentRef.current - 1);
  }, [goTo]);


  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div>
            <div
              className="relative h-[480px] overflow-hidden rounded-sm bg-gray-200"
              role="region"
              aria-roledescription="carousel"
              aria-label={copy.carouselLabel}
            >
              {!uiReady && (
                <div
                  className="absolute inset-0 z-10 bg-gray-200"
                  aria-hidden
                />
              )}

              {TEAM_SLIDES.map((slide, idx) => {
                const active = idx === current;
                const alt = lang === "fr" ? slide.altFr : slide.altEn;
                return (
                  <div
                    key={slide.outBase}
                    className={`absolute inset-0 transition-opacity will-change-[opacity] ${
                      active
                        ? uiReady
                          ? "opacity-100"
                          : "opacity-0"
                        : "opacity-0 pointer-events-none"
                    }`}
                    style={{ transitionDuration: `${fadeMs}ms` }}
                    aria-hidden={!active}
                  >
                    <picture className="absolute inset-0 block h-full w-full">
                      <source
                        type="image/avif"
                        srcSet={formatResponsiveSrcSet(slide.outBase, "avif")
                          .split(", ")
                          .map((entry) => {
                            const [url, w] = entry.split(" ");
                            return `${assetUrl(url)} ${w}`;
                          })
                          .join(", ")}
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                      <source
                        type="image/webp"
                        srcSet={formatResponsiveSrcSet(slide.outBase, "webp")
                          .split(", ")
                          .map((entry) => {
                            const [url, w] = entry.split(" ");
                            return `${assetUrl(url)} ${w}`;
                          })
                          .join(", ")}
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                      <img
                        src={assetUrl(slide.jpeg)}
                        alt={alt}
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={idx === 0 ? "high" : "low"}
                        className={`absolute inset-0 h-full w-full object-cover ${slide.objectPosition}`}
                      />
                    </picture>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md transition-colors hover:bg-[#0f1f4b] hover:text-white"
                aria-label={lang === "fr" ? "Photo précédente" : "Previous photo"}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md transition-colors hover:bg-[#0f1f4b] hover:text-white"
                aria-label={lang === "fr" ? "Photo suivante" : "Next photo"}
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div
                className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-4"
                role="tablist"
                aria-label={lang === "fr" ? "Choisir une photo" : "Choose a photo"}
              >
                <div className="flex gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
                  {TEAM_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === current}
                      onClick={() => goTo(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                        idx === current ? "w-6 bg-white" : "w-1.5 bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#0f1f4b]">
              {copy.eyebrow}
            </div>
            <h2 className="mb-3 font-display text-4xl font-bold uppercase leading-tight text-[#0f1f4b] md:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
            <p className="mb-7 text-[15px] leading-relaxed text-gray-600">
              {copy.description}
            </p>
            <div className="space-y-4">
              {copy.values.map((value, idx) => (
                <div key={idx} className="flex gap-3.5">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#0f1f4b]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-[#0f1f4b]">
                      {value.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
