"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Copy, Check, Link2 } from "lucide-react";
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

/* ── Animated result card ── */
function ResultCard({
  data,
  copyMap,
}: {
  data: ReferralResponse;
  copyMap: Record<string, string>;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 rounded-sm border border-green-200 bg-green-50 p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0" />
        <span className="text-base font-semibold text-green-800">
          {copyMap["referrals.successLookup"]}
        </span>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0f1f4b] mb-2">
        {copyMap["referrals.yourLink"]}
      </p>
      <div className="flex items-center gap-2 rounded border border-green-200 bg-white px-3 py-2.5">
        <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="flex-1 break-all text-sm text-slate-800 font-medium select-all">
          {data.referralLink}
        </span>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 rounded bg-[#0f1f4b] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1a3070]"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? copyMap["referrals.copied"] : copyMap["referrals.copy"]}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded border border-green-200 bg-white px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
            {copyMap["referrals.code"]}
          </p>
          <p className="text-lg font-bold text-[#0f1f4b]">
            {data.profile.referral_code}
          </p>
        </div>
        <div className="rounded border border-green-200 bg-white px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
            {copyMap["referrals.count"]}
          </p>
          <p className="text-lg font-bold text-[#0f1f4b]">
            {data.profile.referral_count}
          </p>
        </div>
      </div>

      {copyMap["referrals.writeItDown"] && (
        <p className="mt-4 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-800">
          <span className="mt-0.5 text-base leading-none">✏️</span>
          {copyMap["referrals.writeItDown"]}
        </p>
      )}
    </motion.div>
  );
}

/* ── Animated error banner with shake ── */
function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        x: [0, -10, 10, -7, 7, -4, 4, 0],
        transition: {
          x: { duration: 0.5, ease: "easeInOut" },
          opacity: { duration: 0.15 },
        },
      }}
      exit={{ opacity: 0 }}
      className="mt-4 flex items-start gap-3 rounded border border-red-200 bg-red-50 px-4 py-3"
    >
      <XCircle className="mt-0.5 w-5 h-5 text-red-500 flex-shrink-0" />
      <p className="text-sm text-red-700">{message}</p>
    </motion.div>
  );
}

/* ── Numbered step card ── */
function StepCard({
  number,
  label,
  hint,
  children,
}: {
  number: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-start gap-5 mb-7">
        <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#0f1f4b] text-white font-display text-2xl font-bold">
          {number}
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold uppercase text-[#0f1f4b] leading-tight">
            {label}
          </h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-gray-500">
            {hint}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ReferralsPage() {
  const { t, lang } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [lookupCode, setLookupCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [createError, setCreateError] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [createResult, setCreateResult] = useState<ReferralResponse | null>(null);
  const [lookupResult, setLookupResult] = useState<ReferralResponse | null>(null);

  const copyMap: Record<string, string> = {
    "referrals.yourLink": t("referrals.yourLink"),
    "referrals.code": t("referrals.code"),
    "referrals.count": t("referrals.count"),
    "referrals.copy": t("referrals.copy"),
    "referrals.copied": t("referrals.copied"),
    "referrals.successCreate": t("referrals.successCreate"),
    "referrals.successLookup": t("referrals.successLookup"),
    "referrals.writeItDown": t("referrals.writeItDown"),
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError("");
    setCreateResult(null);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone: phone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || t("referrals.createError"));
        return;
      }
      setCreateResult(data.data);
      setLookupCode(data.data.profile.referral_code);
    } catch {
      setCreateError(t("referrals.createError"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLookingUp(true);
    setLookupError("");
    setLookupResult(null);
    try {
      const query = new URLSearchParams({ code: lookupCode.trim() }).toString();
      const res = await fetch(`/api/referrals?${query}`);
      const data = await res.json();
      if (!res.ok) {
        setLookupError(data.error || t("referrals.lookupError"));
        return;
      }
      setLookupResult(data.data);
    } catch {
      setLookupError(t("referrals.lookupError"));
    } finally {
      setIsLookingUp(false);
    }
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-4 py-3.5 text-base outline-none transition-colors focus:border-[#0f1f4b] focus:ring-2 focus:ring-[#0f1f4b]/10 placeholder:text-gray-400";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* background blobs */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,rgba(37,99,235,0.16),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-[#0f1f4b]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-[#0f1f4b]/10 blur-3xl"
        aria-hidden
      />

      {/* Hero */}
      <section className="relative border-b border-[#0f1f4b]/15 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-8 py-14 md:px-16">
          <div className="inline-flex rounded-full border border-[#0f1f4b]/20 bg-[#eef0f6]/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f1f4b]">
            {t("referrals.eyebrow")}
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] text-[#0f1f4b] md:text-6xl">
            {t("referrals.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-gray-600">
            {t("referrals.description")}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="relative py-14">
        <div className="mx-auto max-w-6xl px-8 md:px-16 space-y-8">

          {/* STEP 1 + STEP 2 — side by side on desktop */}
          <div className="relative flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">

            {/* STEP 1 — GENERATE */}
            <StepCard
              number="1"
              label={t("referrals.step1Label")}
              hint={t("referrals.step1Hint")}
            >
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#0f1f4b]">
                    {t("referrals.fullName")}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("referrals.namePlaceholder")}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#0f1f4b]">
                    {t("referrals.phone")}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder={t("referrals.phonePlaceholder")}
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-institutional-primary w-full py-3.5 text-base disabled:opacity-60"
                >
                  {isCreating
                    ? t("referrals.createSubmitting")
                    : t("referrals.createSubmit")}
                </button>
              </form>

              <AnimatePresence mode="wait">
                {createError && (
                  <ErrorBanner key="create-err" message={createError} />
                )}
                {createResult && (
                  <ResultCard key="create-ok" data={createResult} copyMap={copyMap} />
                )}
              </AnimatePresence>
            </StepCard>

            {/* Mobile-only horizontal divider */}
            <div className="lg:hidden flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {lang === "fr" ? "ou" : "or"}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Desktop-only vertical divider with "or" badge */}
            <div className="hidden lg:flex absolute inset-y-0 left-1/2 -translate-x-1/2 flex-col items-center justify-center pointer-events-none z-10">
              <div className="flex-1 w-px bg-gray-200" />
              <span className="my-3 px-2.5 py-1 rounded-full border border-gray-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {lang === "fr" ? "ou" : "or"}
              </span>
              <div className="flex-1 w-px bg-gray-200" />
            </div>

            {/* STEP 2 — VERIFY */}
            <StepCard
              number="2"
              label={t("referrals.step2Label")}
              hint={t("referrals.step2Hint")}
            >
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#0f1f4b]">
                    {t("referrals.lookupField")}
                  </label>
                  <input
                    type="text"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value)}
                    placeholder={t("referrals.lookupPlaceholder")}
                    required
                    autoComplete="off"
                    spellCheck={false}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLookingUp}
                  className="btn-institutional-secondary w-full py-3.5 text-base disabled:opacity-60"
                >
                  {isLookingUp
                    ? t("referrals.lookupSubmitting")
                    : t("referrals.lookupSubmit")}
                </button>
              </form>

              <AnimatePresence mode="wait">
                {lookupError && (
                  <ErrorBanner key="lookup-err" message={lookupError} />
                )}
                {lookupResult && (
                  <ResultCard key="lookup-ok" data={lookupResult} copyMap={copyMap} />
                )}
              </AnimatePresence>
            </StepCard>
          </div>

          {/* How it works — full width below both cards */}
          <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold uppercase text-[#0f1f4b] mb-5">
              {t("referrals.howItWorks")}
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                t("referrals.step1"),
                t("referrals.step2"),
                t("referrals.step3"),
                t("referrals.step4"),
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed text-gray-700">
                  <span className="mt-0.5 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#eef0f6] text-[11px] font-bold text-[#0f1f4b]">
                    {i + 1}
                  </span>
                  {step.replace(/^\d+\.\s*/, "")}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </section>
    </main>
  );
}
