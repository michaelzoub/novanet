"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const CDN_BASE = (process.env.NEXT_PUBLIC_ASSET_CDN ?? "").replace(/\/$/, "");
const assetUrl = (path: string) => (CDN_BASE ? `${CDN_BASE}${path}` : path);

type ResultPair = {
  beforeJpeg: string;
  afterJpeg: string;
  beforePreload: string;
  afterPreload: string;
  beforeSet: { avif: string; webp: string };
  afterSet: { avif: string; webp: string };
  titleFr: string;
  titleEn: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
};

const beforeAfterPairs: ResultPair[] = [
  {
    beforeJpeg: "/before1.jpeg",
    afterJpeg: "/after1.jpeg",
    beforePreload: "/results/before1-1280.webp",
    afterPreload: "/results/after1-1280.webp",
    beforeSet: {
      avif:
        "/results/before1-640.avif 640w, /results/before1-960.avif 960w, /results/before1-1280.avif 1280w, /results/before1-1600.avif 1600w",
      webp:
        "/results/before1-640.webp 640w, /results/before1-960.webp 960w, /results/before1-1280.webp 1280w, /results/before1-1600.webp 1600w",
    },
    afterSet: {
      avif:
        "/results/after1-640.avif 640w, /results/after1-960.avif 960w, /results/after1-1280.avif 1280w, /results/after1-1600.avif 1600w",
      webp:
        "/results/after1-640.webp 640w, /results/after1-960.webp 960w, /results/after1-1280.webp 1280w, /results/after1-1600.webp 1600w",
    },
    titleFr: "Lavage de Vitres",
    titleEn: "Window Washing",
  },
  {
    beforeJpeg: "/before2.jpeg",
    afterJpeg: "/after2.jpeg",
    beforePreload: "/results/before2-1280.webp",
    afterPreload: "/results/after2-1280.webp",
    beforeSet: {
      avif:
        "/results/before2-640.avif 640w, /results/before2-960.avif 960w, /results/before2-1280.avif 1280w, /results/before2-1600.avif 1600w",
      webp:
        "/results/before2-640.webp 640w, /results/before2-960.webp 960w, /results/before2-1280.webp 1280w, /results/before2-1600.webp 1600w",
    },
    afterSet: {
      avif:
        "/results/after2-640.avif 640w, /results/after2-960.avif 960w, /results/after2-1280.avif 1280w, /results/after2-1600.avif 1600w",
      webp:
        "/results/after2-640.webp 640w, /results/after2-960.webp 960w, /results/after2-1280.webp 1280w, /results/after2-1600.webp 1600w",
    },
    titleFr: "Lavage à Pression",
    titleEn: "Pressure Washing",
  },
  {
    beforeJpeg: "/before3.jpeg",
    afterJpeg: "/after3.jpeg",
    beforePreload: "/results/before3-1280.webp",
    afterPreload: "/results/after3-1280.webp",
    beforeSet: {
      avif:
        "/results/before3-640.avif 640w, /results/before3-960.avif 960w, /results/before3-1280.avif 1280w, /results/before3-1600.avif 1600w",
      webp:
        "/results/before3-640.webp 640w, /results/before3-960.webp 960w, /results/before3-1280.webp 1280w, /results/before3-1600.webp 1600w",
    },
    afterSet: {
      avif:
        "/results/after3-640.avif 640w, /results/after3-960.avif 960w, /results/after3-1280.avif 1280w, /results/after3-1600.avif 1600w",
      webp:
        "/results/after3-640.webp 640w, /results/after3-960.webp 960w, /results/after3-1280.webp 1280w, /results/after3-1600.webp 1600w",
    },
    titleFr: "Scellant de Pavés",
    titleEn: "Paver Sealing",
  },
  {
    beforeJpeg: "/before4.jpeg",
    afterJpeg: "/after4.jpeg",
    beforePreload: "/results/before4-1280.webp",
    afterPreload: "/results/after4-1280.webp",
    beforeSet: {
      avif:
        "/results/before4-640.avif 640w, /results/before4-960.avif 960w, /results/before4-1280.avif 1280w, /results/before4-1600.avif 1600w",
      webp:
        "/results/before4-640.webp 640w, /results/before4-960.webp 960w, /results/before4-1280.webp 1280w, /results/before4-1600.webp 1600w",
    },
    afterSet: {
      avif:
        "/results/after4-640.avif 640w, /results/after4-960.avif 960w, /results/after4-1280.avif 1280w, /results/after4-1600.avif 1600w",
      webp:
        "/results/after4-640.webp 640w, /results/after4-960.webp 960w, /results/after4-1280.webp 1280w, /results/after4-1600.webp 1600w",
    },
    titleFr: "Nettoyage en profondeur",
    titleEn: "Deep cleaning",
    objectPosition: "center bottom",
  },
  {
    beforeJpeg: "/before6.jpeg",
    afterJpeg: "/after6.jpeg",
    beforePreload: "/results/before6-1280.webp",
    afterPreload: "/results/after6-1280.webp",
    beforeSet: {
      avif:
        "/results/before6-640.avif 640w, /results/before6-960.avif 960w, /results/before6-1280.avif 1280w, /results/before6-1600.avif 1600w",
      webp:
        "/results/before6-640.webp 640w, /results/before6-960.webp 960w, /results/before6-1280.webp 1280w, /results/before6-1600.webp 1600w",
    },
    afterSet: {
      avif:
        "/results/after6-640.avif 640w, /results/after6-960.avif 960w, /results/after6-1280.avif 1280w, /results/after6-1600.avif 1600w",
      webp:
        "/results/after6-640.webp 640w, /results/after6-960.webp 960w, /results/after6-1280.webp 1280w, /results/after6-1600.webp 1600w",
    },
    titleFr: "Finition détaillée",
    titleEn: "Detailed finish",
  },
];

export default function Results() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  // uiReady = wait only for slide 0 images (before/after) so the first paint isn't grey.
  const [uiReady, setUiReady] = useState(false);
  const [autoplayKey, setAutoplayKey] = useState(0);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const loadedUrlsRef = useRef<Set<string>>(new Set());
  const switchReqRef = useRef(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const currentSlideRef = useRef(currentSlide);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const copy = useMemo(() => {
    return lang === "fr"
      ? {
          title: "Nos résultats",
          description:
            "Découvrez la transformation de propriétés grâce à nos services professionnels.",
          before: "Avant",
          after: "Après",
        }
      : {
          title: "Our Results",
          description:
            "See how our professional services transform properties.",
          before: "Before",
          after: "After",
        };
  }, [lang]);

  // Preload slide 0 first (so UI doesn't look stuck),
  // then preload remaining images in the background.
  useEffect(() => {
    let cancelled = false;
    const slide0 = [beforeAfterPairs[0].beforePreload, beforeAfterPairs[0].afterPreload];
    const remaining = beforeAfterPairs
      .slice(1)
      .flatMap((p) => [p.beforePreload, p.afterPreload]);

    const loadImages = async (urls: string[]) => {
      await Promise.all(
        urls.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = src;
            }),
        ),
      );
    };

    void loadImages(slide0).then(() => {
      if (cancelled) return;
      setUiReady(true);

      // Background preload starts only after slide 0 is done.
    void loadImages(remaining);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const preloadSrc = useCallback((src: string) => {
    return new Promise<void>((resolve) => {
      if (loadedUrlsRef.current.has(src)) return resolve();
      const img = new Image();
      img.onload = () => {
        loadedUrlsRef.current.add(src);
        resolve();
      };
      img.onerror = () => {
        // Still resolve so UI doesn't get stuck.
        loadedUrlsRef.current.add(src);
        resolve();
      };
      img.src = src;
    });
  }, []);

  const preloadSlide = useCallback(
    async (idx: number) => {
      const p = beforeAfterPairs[idx];
      await Promise.all([preloadSrc(p.beforePreload), preloadSrc(p.afterPreload)]);
    },
    [preloadSrc],
  );

  const switchTo = useCallback(
    (idx: number) => {
    if (idx === currentSlideRef.current) return;

    const req = ++switchReqRef.current;
    setIsSwitching(true);
    setIsDragging(false);

      void preloadSlide(idx).then(() => {
      // If user switched again while waiting, ignore this one.
      if (req !== switchReqRef.current) return;
      setCurrentSlide(idx);
      setSliderPosition(50);
      setIsSwitching(false);
    });
    },
    [preloadSlide],
  );

  // Auto-rotate slides (disabled when user prefers reduced motion).
  // autoplayKey resets the interval whenever the user manually navigates.
  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      switchTo((currentSlideRef.current + 1) % beforeAfterPairs.length);
    }, 6000);
    return () => window.clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchTo, reduceMotion, autoplayKey]);

  const computePercent = (clientX: number) => {
    const el = sliderRef.current;
    if (!el) return 50;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setSliderPosition(computePercent(e.clientX));
  };

  const onMouseDown = () => {
    if (isSwitching) return;
    setIsDragging(true);
  };
  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => setSliderPosition(computePercent(e.clientX));
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const fadeMs = reduceMotion ? 120 : 400;

  return (
    <section id="resultats" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[2px] text-[#0f1f4b] mb-2">
              Portfolio
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-[#0f1f4b] mb-3 leading-tight">
              {copy.title}
            </h2>
            <p className="text-[15px] text-gray-600 max-w-xl leading-relaxed">
              {copy.description}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-sm overflow-hidden bg-slate-100">
            <div
              ref={sliderRef}
              className="relative h-[500px] w-full cursor-col-resize select-none touch-pan-y"
              onMouseMove={onMouseMove}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={(e) => {
                if (isSwitching) return;
                setIsDragging(true);
                if (e.touches[0]) setSliderPosition(computePercent(e.touches[0].clientX));
              }}
              onTouchMove={(e) => {
                if (isSwitching) return;
                if (!isDragging) return;
                if (e.touches.length === 0) return;
                setSliderPosition(computePercent(e.touches[0].clientX));
              }}
              onTouchEnd={() => setIsDragging(false)}
            >
              {!uiReady && (
                <div className="absolute inset-0 z-10" aria-hidden>
                  <div className="h-full w-full shimmer-bg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-[#0f1f4b] animate-spin" />
                  </div>
                </div>
              )}

              {beforeAfterPairs.map((p, idx) => {
                const active = idx === currentSlide;
                return (
                  <div
                    key={p.beforeJpeg}
                    className={`absolute inset-0 transition-opacity will-change-[opacity] ${p.objectFit === "contain" ? "bg-gray-900" : ""} ${
                      active
                        ? uiReady
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                        : "opacity-0 pointer-events-none"
                    }`}
                    style={{
                      transitionDuration: `${fadeMs}ms`,
                    }}
                    aria-hidden={!active}
                  >
                    <div className="absolute inset-0">
                      <picture className="absolute inset-0 block h-full w-full">
                        <source
                          type="image/avif"
                          srcSet={p.beforeSet.avif
                            .split(", ")
                            .map((entry) => {
                              const [url, w] = entry.split(" ");
                              return `${assetUrl(url)} ${w}`;
                            })
                            .join(", ")}
                          sizes="(max-width: 768px) 100vw, 1200px"
                        />
                        <source
                          type="image/webp"
                          srcSet={p.beforeSet.webp
                            .split(", ")
                            .map((entry) => {
                              const [url, w] = entry.split(" ");
                              return `${assetUrl(url)} ${w}`;
                            })
                            .join(", ")}
                          sizes="(max-width: 768px) 100vw, 1200px"
                        />
                        <img
                          src={assetUrl(p.beforeJpeg)}
                          alt={`${copy.before} — ${lang === "fr" ? p.titleFr : p.titleEn}`}
                          loading={active ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={active ? "high" : "low"}
                          className={`h-full w-full ${p.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                          style={p.objectPosition ? { objectPosition: p.objectPosition } : undefined}
                        />
                      </picture>
                    </div>
                    {/* True overlay reveal: clip the top layer without resizing it */}
                    <div
                      className="absolute inset-0"
                      style={{
                        // Show AFTER on the right side of the handle (true overlay, no resizing).
                        clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                        WebkitClipPath: `inset(0 0 0 ${sliderPosition}%)`,
                      }}
                    >
                      <picture className="absolute inset-0 block h-full w-full">
                        <source
                          type="image/avif"
                          srcSet={p.afterSet.avif
                            .split(", ")
                            .map((entry) => {
                              const [url, w] = entry.split(" ");
                              return `${assetUrl(url)} ${w}`;
                            })
                            .join(", ")}
                          sizes="(max-width: 768px) 100vw, 1200px"
                        />
                        <source
                          type="image/webp"
                          srcSet={p.afterSet.webp
                            .split(", ")
                            .map((entry) => {
                              const [url, w] = entry.split(" ");
                              return `${assetUrl(url)} ${w}`;
                            })
                            .join(", ")}
                          sizes="(max-width: 768px) 100vw, 1200px"
                        />
                        <img
                          src={assetUrl(p.afterJpeg)}
                          alt={`${copy.after} — ${lang === "fr" ? p.titleFr : p.titleEn}`}
                          loading={active ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={active ? "high" : "low"}
                          className={`h-full w-full ${p.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                          style={p.objectPosition ? { objectPosition: p.objectPosition } : undefined}
                        />
                      </picture>
                    </div>
                  </div>
                );
              })}

              {uiReady && (
                <>
                  <div
                    className="absolute bottom-0 top-0 z-10 w-0.5 bg-white shadow-lg"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-white shadow-lg active:cursor-grabbing">
                      <div className="flex gap-1">
                        <div className="h-4 w-1 rounded bg-gray-400" />
                        <div className="h-4 w-1 rounded bg-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-4 top-4 z-10 rounded bg-black/50 px-3 py-1.5 text-sm font-semibold text-white">
                    {copy.before}
                  </div>
                  <div className="absolute right-4 top-4 z-10 rounded bg-black/50 px-3 py-1.5 text-sm font-semibold text-white">
                    {copy.after}
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isSwitching) return;
              setAutoplayKey((k) => k + 1);
              switchTo((currentSlideRef.current - 1 + beforeAfterPairs.length) % beforeAfterPairs.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#0f1f4b] hover:text-white transition-colors z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (isSwitching) return;
              setAutoplayKey((k) => k + 1);
              switchTo((currentSlideRef.current + 1) % beforeAfterPairs.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#0f1f4b] hover:text-white transition-colors z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex justify-center gap-2 mt-5">
            {beforeAfterPairs.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (isSwitching) return;
                  setAutoplayKey((k) => k + 1);
                  switchTo(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                  idx === currentSlide ? "w-6 bg-[#0f1f4b]" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}