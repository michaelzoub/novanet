import { NextResponse } from "next/server";
import { referralManager } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { code: string } },
) {
  const code = params.code?.trim().toLowerCase();
  const url = new URL(request.url);

  if (!code) {
    return NextResponse.redirect(new URL("/#contact", url));
  }

  try {
    const profile = await referralManager.getReferralProfileByCode(code);

    if (!profile) {
      return NextResponse.redirect(new URL("/#contact", url));
    }

    return NextResponse.redirect(new URL(`/?ref=${code}#contact`, url));
  } catch (error) {
    console.error("Error resolving referral code:", error);
    return NextResponse.redirect(new URL("/#contact", url));
  }
}
