import { NextResponse } from "next/server";
import { jobManager } from "@/lib/supabase";

export async function GET() {
  try {
    // Get all completed jobs with reviews
    const jobs = await jobManager.getAllJobs();
    
    // Filter jobs that have reviews and ratings
    const reviews = jobs
      .filter((job) => job.review && job.rating)
      .map((job) => ({
        id: job.id,
        name: `Client ${job.id.slice(0, 8)}`, // You can link this to client name if needed
        rating: job.rating || 5,
        text: job.review || "",
        jobType: job.job_type,
        date: job.completed_date || job.created_at,
      }));

    return NextResponse.json({ body: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", body: [] },
      { status: 500 }
    );
  }
}
