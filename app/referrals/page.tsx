"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type ReferralResponse = {
  profile: {
    full_name: string;
    referral_code: string;
    referral_count: number;
    reward_percent: number;
  };
  referralLink: string;
};

export default function ReferralsPage() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [lookupName, setLookupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [createError, setCreateError] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [result, setResult] = useState<ReferralResponse | null>(null);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    setCreateError("");

    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCreateError(data.error || t("referrals.createError"));
        return;
      }

      setResult(data.data);
      setLookupName(data.data.profile.full_name);
    } catch (error) {
      setCreateError(t("referrals.createError"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLookingUp(true);
    setLookupError("");

    try {
      const query = new URLSearchParams({ fullName: lookupName }).toString();
      const response = await fetch(`/api/referrals?${query}`);
      const data = await response.json();

      if (!response.ok) {
        setLookupError(data.error || t("referrals.lookupError"));
        return;
      }

      setResult(data.data);
    } catch (error) {
      setLookupError(t("referrals.lookupError"));
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-8 py-14 md:px-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2563eb]">
            {t("referrals.eyebrow")}
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-bold uppercase leading-[0.95] text-[#0f1f4b] md:text-6xl">
            {t("referrals.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-gray-600">
            {t("referrals.description")}
          </p>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-8 md:px-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <section className="border border-gray-200 bg-white p-7 shadow-sm">
              <h2 className="font-display text-2xl font-bold uppercase text-[#0f1f4b]">
                {t("referrals.createTitle")}
              </h2>
              <p className="mt-2 text-[13px] text-gray-600">
                {t("referrals.createDescription")}
              </p>

              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                    {t("referrals.fullName")}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Jean Tremblay"
                    required
                    className="w-full border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#2563eb]"
                  />
                </div>

                {createError && (
                  <div className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {createError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating
                    ? t("referrals.createSubmitting")
                    : t("referrals.createSubmit")}
                </button>
              </form>
            </section>

            <section className="border border-gray-200 bg-white p-7 shadow-sm">
              <h2 className="font-display text-2xl font-bold uppercase text-[#0f1f4b]">
                {t("referrals.lookupTitle")}
              </h2>
              <p className="mt-2 text-[13px] text-gray-600">
                {t("referrals.lookupDescription")}
              </p>

              <form onSubmit={handleLookup} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                    {t("referrals.fullName")}
                  </label>
                  <input
                    type="text"
                    value={lookupName}
                    onChange={(event) => setLookupName(event.target.value)}
                    placeholder="Jean Tremblay"
                    required
                    className="w-full border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#2563eb]"
                  />
                </div>

                {lookupError && (
                  <div className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {lookupError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLookingUp}
                  className="w-full border border-[#0f1f4b] bg-white px-5 py-2.5 text-sm font-semibold text-[#0f1f4b] transition-colors hover:border-[#2563eb] hover:text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLookingUp
                    ? t("referrals.lookupSubmitting")
                    : t("referrals.lookupSubmit")}
                </button>
              </form>
            </section>
          </div>

          <aside className="border border-gray-200 bg-white p-7 shadow-sm">
            <h2 className="font-display text-2xl font-bold uppercase text-[#0f1f4b]">
              {t("referrals.howItWorks")}
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-gray-700">
              <p>{t("referrals.step1")}</p>
              <p>{t("referrals.step2")}</p>
              <p>{t("referrals.step3")}</p>
              <p>{t("referrals.step4")}</p>
            </div>

            {result && (
              <div className="mt-8 border border-gray-200 bg-slate-50 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2563eb]">
                  {t("referrals.yourLink")}
                </p>
                <p className="mt-3 break-all text-sm font-semibold text-slate-900">
                  {result.referralLink}
                </p>
                <p className="mt-4 text-sm text-slate-600">
                  {t("referrals.code")}:{" "}
                  <span className="font-semibold">
                    {result.profile.referral_code}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {t("referrals.count")}:{" "}
                  <span className="font-semibold">
                    {result.profile.referral_count}
                  </span>
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
