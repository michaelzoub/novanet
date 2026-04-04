"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  jobType?: string;
  date?: string;
  source?: "google" | "internal";
}

interface GoogleMeta {
  rating?: number;
  userRatingsTotal?: number;
  placeName?: string;
}

/** Même lien que novanet_site-32.html (share.google) */
const DEFAULT_GOOGLE_LISTING_URL =
  "https://share.google/0gXX1ufLW8A91Oe0h";

export default function Reviews() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSource, setReviewSource] = useState<"google" | "internal" | null>(
    null,
  );
  const [googleMeta, setGoogleMeta] = useState<GoogleMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/getReviews?lang=${encodeURIComponent(lang)}`,
        );
        const data = await response.json();
        if (data.body && Array.isArray(data.body)) {
          setReviews(data.body);
        }
        if (data.source === "google" || data.source === "internal") {
          setReviewSource(data.source);
        }
        if (data.googleMeta && typeof data.googleMeta === "object") {
          setGoogleMeta(data.googleMeta as GoogleMeta);
        } else {
          setGoogleMeta(null);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [lang]);

  useEffect(() => {
    if (reduceMotion || reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % Math.ceil(reviews.length / 2));
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length, reduceMotion]);

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
      : googleMeta?.rating ?? 5.0;

  const displayRating =
    reviewSource === "google" && googleMeta?.rating != null
      ? googleMeta.rating
      : averageRating;

  const reviewCountLabel = 49;

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
          eyebrow: "Témoignages",
          title: "Ce que disent nos clients",
          basedOn: "Basé sur",
          reviews: "avis",
          loading: "Chargement des avis…",
          empty: "Aucun avis disponible pour le moment.",
          verified: "Client vérifié",
          googleCta: "Voir sur Google",
          googleSummary:
            "Les avis détaillés sont affichés sur Google. Voici la note publique de l’établissement :",
          seeMore: "Voir tous les avis",
          seeLess: "Réduire",
        }
      : {
          eyebrow: "Testimonials",
          title: "What Our Clients Say",
          basedOn: "Based on",
          reviews: "reviews",
          loading: "Loading reviews...",
          empty: "No reviews available right now.",
          verified: "Verified client",
          googleCta: "View on Google",
          googleSummary:
            "Full reviews are shown on Google. Public listing summary:",
          seeMore: "See all reviews",
          seeLess: "Show less",
        };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#0f1f4b]">
              {copy.eyebrow}
            </div>
            <h2 className="font-display mb-3 text-4xl font-bold uppercase leading-tight text-[#0f1f4b] md:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
            {(reviewSource === "google" || googleMeta != null) && (
              <a
                href={
                  process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ??
                  DEFAULT_GOOGLE_LISTING_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0f1f4b] underline-offset-2 hover:underline"
              >
                {copy.googleCta}
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="font-display text-3xl font-bold text-[#0f1f4b]">
              {displayRating.toFixed(1)}
            </div>
            <div>
              <div className="flex text-[#f59e0b] mb-1">
                {renderStars(Math.round(displayRating))}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {copy.basedOn} {reviewCountLabel} {copy.reviews}
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">{copy.loading}</div>
        ) : reviews.length === 0 ? (
          googleMeta != null &&
          (googleMeta.userRatingsTotal != null ||
            googleMeta.rating != null) ? (
            <div className="rounded-sm border border-gray-200 bg-slate-50/80 px-6 py-10 text-center">
              <p className="mb-3 text-[14px] leading-relaxed text-gray-700">
                {copy.googleSummary}
              </p>
              <div className="mb-2 flex justify-center gap-2 text-[#0f1f4b]">
                <span className="font-display text-3xl font-bold">
                  {googleMeta.rating != null
                    ? googleMeta.rating.toFixed(1)
                    : "—"}
                </span>
                <span className="flex items-center text-[#f59e0b]">
                  {renderStars(Math.round(googleMeta.rating ?? 5))}
                </span>
              </div>
              {googleMeta.userRatingsTotal != null && (
                <p className="mb-5 text-[12px] text-gray-500">
                  {copy.basedOn} {googleMeta.userRatingsTotal}{" "}
                  {copy.reviews} (Google)
                </p>
              )}
              <a
                href={
                  process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ??
                  DEFAULT_GOOGLE_LISTING_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0f1f4b] underline underline-offset-2"
              >
                {copy.googleCta}
              </a>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">{copy.empty}</div>
          )
        ) : (
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, pageIdx) => (
                <div key={pageIdx} className="min-w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                  {reviews.slice(pageIdx * 2, pageIdx * 2 + 2).map((review, idx) => (
                    <ReviewCard key={review.id ?? idx} review={review} verified={copy.verified} renderStars={renderStars} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {reviews.length > 0 && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="flex justify-center items-center gap-3">
                <button
                  onClick={prevPage}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#0f1f4b] hover:text-white hover:border-[#0f1f4b] transition-colors flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToPage(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                        idx === currentPage ? "w-6 bg-[#0f1f4b]" : "w-1.5 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextPage}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#0f1f4b] hover:text-white hover:border-[#0f1f4b] transition-colors flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            <a
              href={process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ?? DEFAULT_GOOGLE_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold text-[#0f1f4b] underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              {copy.seeMore}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  verified,
  renderStars,
}: {
  review: Review;
  verified: string;
  renderStars: (rating: number) => React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0f1f4b] text-sm font-semibold text-white">
          {(review.name?.trim()?.[0] ?? "?").toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-[#0f1f4b]">{review.name}</div>
          <div className="text-[11px] text-gray-500">
            {review.source === "google" ? review.date ?? "Google" : verified}
          </div>
        </div>
      </div>
      <div className="flex text-[#f59e0b] mb-2.5">{renderStars(review.rating)}</div>
      <p className="text-[13px] text-gray-700 leading-relaxed italic">{review.text}</p>
    </div>
  );
}
