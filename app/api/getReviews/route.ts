import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { jobManager } from "@/lib/supabase";
import { fetchGooglePlaceReviews } from "@/lib/google-place-reviews";

const getCachedGoogleReviews = unstable_cache(
  async () => fetchGooglePlaceReviews(),
  ["google-business-reviews-v1"],
  { revalidate: 3600 },
);

export async function GET() {
  try {
    const useGoogle = Boolean(process.env.GOOGLE_MAPS_API_KEY?.trim());

    if (useGoogle) {
      const googleReviews = await getCachedGoogleReviews();
      if (googleReviews && googleReviews.length > 0) {
        return NextResponse.json({
          body: googleReviews,
          source: "google" as const,
        });
      }
      if (googleReviews && googleReviews.length === 0) {
        console.warn(
          "[getReviews] Google Places returned no reviews; falling back to database.",
        );
      }
    }

    const jobs = await jobManager.getAllJobs();
    const reviews = jobs
      .filter((job) => job.review && job.rating)
      .map((job) => ({
        id: job.id,
        name: `Client ${job.id.slice(0, 8)}`,
        rating: job.rating || 5,
        text: job.review || "",
        jobType: job.job_type,
        date: job.completed_date || job.created_at,
        source: "internal" as const,
      }));

    return NextResponse.json({
      body: reviews,
      source: "internal" as const,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", body: [] },
      { status: 500 },
    );
  }
}
