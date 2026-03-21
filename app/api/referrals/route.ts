import { NextResponse } from "next/server";
import { referralManager } from "@/lib/supabase";

function createReferralCode(fullName: string) {
  const firstName = fullName.trim().split(/\s+/)[0] || "";
  const base = firstName
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 36);

  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "novanet"}-${suffix}`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fullName = url.searchParams.get("fullName")?.trim() || "";

    if (fullName.length < 3) {
      return NextResponse.json(
        { error: "Full name is required.", code: "FULL_NAME_REQUIRED" },
        { status: 400 },
      );
    }

    const profile =
      await referralManager.getReferralProfileByFullName(fullName);

    if (!profile) {
      return NextResponse.json(
        { error: "Referral profile not found.", code: "REFERRAL_NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        referralLink: `${url.origin}/r/${profile.referral_code}`,
      },
    });
  } catch (error) {
    console.error("Error fetching referral profile:", error);
    return NextResponse.json(
      { error: "Unable to verify the referral link." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";

    if (fullName.length < 3) {
      return NextResponse.json(
        { error: "Full name is required.", code: "FULL_NAME_REQUIRED" },
        { status: 400 },
      );
    }

    let referralCode = "";

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const candidate = createReferralCode(fullName);
      const existing =
        await referralManager.getReferralProfileByCode(candidate);

      if (!existing) {
        referralCode = candidate;
        break;
      }
    }

    if (!referralCode) {
      return NextResponse.json(
        { error: "Unable to generate a unique referral link." },
        { status: 500 },
      );
    }

    const profile = await referralManager.createReferralProfile({
      full_name: fullName,
      referral_code: referralCode,
      reward_percent: 20,
    });

    const url = new URL(request.url);
    const referralLink = `${url.origin}/r/${profile.referral_code}`;

    return NextResponse.json({
      success: true,
      data: {
        profile,
        referralLink,
      },
    });
  } catch (error) {
    console.error("Error creating referral profile:", error);
    return NextResponse.json(
      { error: "Unable to create the referral link." },
      { status: 500 },
    );
  }
}
