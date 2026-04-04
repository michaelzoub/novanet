import { NextResponse } from "next/server";
import { jobManager } from "@/lib/supabase";
import { markers } from "@/types/markers";

export async function GET() {
  try {
    const jobs = await jobManager.getCompletedJobs();

    // Transform jobs to markers format
    const markersData: markers[] = jobs.map((job) => ({
      id: job.id,
      jobType: job.job_type,
      status: job.status,
      review: job.review || "",
      location: job.location,
      clientId: job.client_id ?? undefined,
    }));

    return NextResponse.json({ body: markersData });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", body: [] },
      { status: 500 }
    );
  }
}
