import { NextResponse } from "next/server";
import { referralManager } from "@/lib/supabase";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const code = authHeader.replace("Bearer ", "").trim();

  const validCode = process.env.DASHBOARD_CODE;

  if (!validCode || code !== validCode) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profiles = await referralManager.getAllReferralProfiles();
    return NextResponse.json({ success: true, data: profiles });
  } catch (error) {
    console.error("Error fetching referral profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch referral profiles." },
      { status: 500 },
    );
  }
}
