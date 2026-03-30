"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const beforeAfterPairs = [
  {
    before: "/before1.jpeg",
    after: "/after1.jpeg",
    title: "Lavage de Vitres",
  },
  {
    before: "/before2.jpeg",
    after: "/after2.jpeg",
    title: "Lavage à Pression",
  },
  {
    before: "/before3.jpeg",
    after: "/after3.jpeg",
    title: "Scellant de Pavés",
  },
];

export default function Results() {
  const { lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % beforeAfterPairs.length);
      setSliderPosition(50);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
      };
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setSliderPosition(50);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % beforeAfterPairs.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + beforeAfterPairs.length) % beforeAfterPairs.length,
    );
    setSliderPosition(50);
  };

  const currentPair = beforeAfterPairs[currentSlide];
  const copy =
    lang === "fr"
      ? {
          title: "Nos résultats",
          description:
            "Découvrez la transformation de propriétés grâce à nos services professionnels.",
          cta: "Voir plus",
          before: "Avant",
          after: "Après",
        }
      : {
          title: "Our Results",
          description:
            "See how our professional services transform properties.",
          cta: "See more",
          before: "Before",
          after: "After",
        };

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
          <div className="relative rounded-sm overflow-hidden">
            <div
              ref={sliderRef}
              className="relative h-[500px] w-full cursor-col-resize select-none"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                key={currentSlide}
                className="animate-results-fade-in absolute inset-0"
              >
                {/* Before Image (Background) */}
                <div className="absolute inset-0">
                  <img
                    src={currentPair.before}
                    alt={`${copy.before} — ${currentPair.title}`}
                    loading="eager"
                    decoding="async"
                    fetchPriority={currentSlide === 0 ? "high" : "auto"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                {/* After Image (Clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: `inset(0 0 0 ${100 - sliderPosition}%)`,
                  }}
                >
                  <img
                    src={currentPair.after}
                    alt={`${copy.after} — ${currentPair.title}`}
                    loading="eager"
                    decoding="async"
                    fetchPriority={currentSlide === 0 ? "high" : "auto"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                {/* Slider Line */}
                <div
                  className="absolute bottom-0 top-0 z-10 w-0.5 bg-white shadow-lg"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-white shadow-lg active:cursor-grabbing">
                    <div className="flex gap-1">
                      <div className="h-4 w-1 rounded bg-gray-400"></div>
                      <div className="h-4 w-1 rounded bg-gray-400"></div>
                    </div>
                  </div>
                </div>
                {/* Labels */}
                <div className="absolute left-4 top-4 rounded bg-black/50 px-3 py-1.5 text-sm font-semibold text-white">
                  {copy.before}
                </div>
                <div className="absolute right-4 top-4 rounded bg-black/50 px-3 py-1.5 text-sm font-semibold text-white">
                  {copy.after}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#0f1f4b] hover:text-white transition-colors z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#0f1f4b] hover:text-white transition-colors z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex justify-center gap-2 mt-5">
            {beforeAfterPairs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? "w-6 bg-[#0f1f4b]"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
