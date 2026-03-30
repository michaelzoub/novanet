"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const beforeAfterPairs = [
  { before: "/before1.jpeg", after: "/after1.jpeg", titleFr: "Lavage de Vitres", titleEn: "Window Washing" },
  { before: "/before2.jpeg", after: "/after2.jpeg", titleFr: "Lavage à Pression", titleEn: "Pressure Washing" },
  { before: "/before3.jpeg", after: "/after3.jpeg", titleFr: "Scellant de Pavés", titleEn: "Paver Sealing" },
];

export default function Results() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  // uiReady = wait only for slide 0 images, so initial render is immediate.
  // allImagesReady = everything preloaded; used later only if we want.
  const [uiReady, setUiReady] = useState(true);
  const [allImagesReady, setAllImagesReady] = useState(false);

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
    const slide0 = [
      beforeAfterPairs[0].before,
      beforeAfterPairs[0].after,
    ];
    const remaining = beforeAfterPairs
      .slice(1)
      .flatMap((p) => [p.before, p.after]);

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
      void loadImages(remaining).then(() => {
        if (!cancelled) setAllImagesReady(true);
      });
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
      await Promise.all([preloadSrc(p.before), preloadSrc(p.after)]);
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

  // Auto-rotate slides.
  useEffect(() => {
    const id = window.setInterval(() => {
      switchTo((currentSlideRef.current + 1) % beforeAfterPairs.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

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
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10" aria-hidden>
                  <div className="h-8 w-8 animate-pulse rounded-full border-2 border-[#0f1f4b]/20 border-t-[#0f1f4b]" />
                </div>
              )}

              {beforeAfterPairs.map((p, idx) => {
                const active = idx === currentSlide;
                return (
                  <div
                    key={p.before}
                    className={`absolute inset-0 transition-opacity will-change-[opacity] ${
                      active ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    style={{
                      transitionDuration: `${fadeMs}ms`,
                    }}
                    aria-hidden={!active}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={p.before}
                        alt={`${copy.before} — ${lang === "fr" ? p.titleFr : p.titleEn}`}
                        loading={active ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={active ? "high" : "low"}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    {/* More stable than clip-path: we crop via container width */}
                    <div
                      className="absolute inset-y-0 right-0 overflow-hidden"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={p.after}
                        alt={`${copy.after} — ${lang === "fr" ? p.titleFr : p.titleEn}`}
                        loading={active ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={active ? "high" : "low"}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
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
                  switchTo(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
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