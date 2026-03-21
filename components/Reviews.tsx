"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  jobType?: string;
  date?: string;
}

export default function Reviews() {
  const { lang } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("/api/getReviews");
        const data = await response.json();
        if (data.body && Array.isArray(data.body)) {
          setReviews(data.body);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % Math.ceil(reviews.length / 2));
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const goToPage = (page: number) => {
    if (reviews.length === 0) return;
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (reviews.length === 0) return;
    setCurrentPage((prev) => (prev + 1) % Math.ceil(reviews.length / 2));
  };

  const prevPage = () => {
    if (reviews.length === 0) return;
    setCurrentPage(
      (prev) =>
        (prev - 1 + Math.ceil(reviews.length / 2)) %
        Math.ceil(reviews.length / 2),
    );
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 5.0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };
  const copy =
    lang === "fr"
      ? {
          eyebrow: "Temoignages",
          title: "Ce Que Disent Nos Clients",
          basedOn: "Base sur",
          reviews: "avis",
          loading: "Chargement des avis...",
          empty: "Aucun avis disponible pour le moment.",
          verified: "Client verifie",
        }
      : {
          eyebrow: "Testimonials",
          title: "What Our Clients Say",
          basedOn: "Based on",
          reviews: "reviews",
          loading: "Loading reviews...",
          empty: "No reviews available right now.",
          verified: "Verified client",
        };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[2px] text-[#2563eb] mb-2">
              {copy.eyebrow}
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-[#0f1f4b] mb-3 leading-tight">
              {copy.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-display text-3xl font-bold text-[#0f1f4b]">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <div className="flex text-[#f59e0b] mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {copy.basedOn} {reviews.length} {copy.reviews}
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">{copy.loading}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{copy.empty}</div>
        ) : (
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-600 ease-out"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {Array.from({ length: Math.ceil(reviews.length / 2) }).map(
                (_, pageIdx) => (
                  <div
                    key={pageIdx}
                    className="min-w-full grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {reviews
                      .slice(pageIdx * 2, pageIdx * 2 + 2)
                      .map((review, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-semibold text-sm">
                              {review.name[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-[#0f1f4b] text-sm">
                                {review.name}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                {copy.verified}
                              </div>
                            </div>
                          </div>
                          <div className="flex text-[#f59e0b] mb-2.5">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-[13px] text-gray-700 leading-relaxed italic">
                            {review.text}
                          </p>
                        </div>
                      ))}
                  </div>
                ),
              )}
            </div>
          </div>
        )}
        {reviews.length > 0 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={prevPage}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: Math.ceil(reviews.length / 2) }).map(
                (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentPage
                        ? "w-6 bg-[#2563eb]"
                        : "w-1.5 bg-gray-300"
                    }`}
                  />
                ),
              )}
            </div>
            <button
              onClick={nextPage}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
