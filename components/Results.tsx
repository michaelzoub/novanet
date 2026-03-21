"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const beforeAfterPairs = [
  {
    before: "/placeholder-before-1.jpg",
    after: "/placeholder-after-1.jpg",
    title: "Lavage de Vitres",
  },
  {
    before: "/placeholder-before-2.jpg",
    after: "/placeholder-after-2.jpg",
    title: "Lavage à Pression",
  },
  {
    before: "/placeholder-before-3.jpg",
    after: "/placeholder-after-3.jpg",
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
          title: "Nos Resultats",
          description:
            "Decouvrez la transformation de proprietes grace a nos services professionnels.",
          cta: "Voir plus",
          before: "Avant",
          after: "Apres",
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
            <div className="text-[10px] font-semibold uppercase tracking-[2px] text-[#2563eb] mb-2">
              Portfolio
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-[#0f1f4b] mb-3 leading-tight">
              {copy.title}
            </h2>
            <p className="text-[15px] text-gray-600 max-w-xl leading-relaxed">
              {copy.description}
            </p>
          </div>
          <button className="hidden md:block px-5 py-2 rounded border border-[#2563eb] text-[#2563eb] text-sm font-semibold hover:bg-[#2563eb] hover:text-white transition-colors">
            {copy.cta}
          </button>
        </div>
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden">
            <div
              ref={sliderRef}
              className="relative w-full h-[500px] cursor-col-resize select-none"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Before Image (Background) */}
              <div className="absolute inset-0">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">
                    {copy.before} - {currentPair.title}
                  </span>
                </div>
              </div>
              {/* After Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">
                    {copy.after} - {currentPair.title}
                  </span>
                </div>
              </div>
              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </div>
              {/* Labels */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded text-sm font-semibold">
                {copy.before}
              </div>
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded text-sm font-semibold">
                {copy.after}
              </div>
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#2563eb] hover:text-white transition-colors z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#2563eb] hover:text-white transition-colors z-20"
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
                    ? "w-6 bg-[#2563eb]"
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
