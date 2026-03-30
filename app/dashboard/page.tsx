"use client";

import { useState } from "react";

type ReferralProfile = {
  id: string;
  full_name: string;
  referral_code: string;
  referral_count: number;
  reward_percent: number;
  created_at: string;
};

export default function DashboardPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<ReferralProfile[] | null>(null);
  const [sessionCode, setSessionCode] = useState("");

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${code}` },
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Code invalide. Veuillez réessayer.");
        return;
      }

      setProfiles(data.data);
      setSessionCode(code);
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${sessionCode}` },
      });
      const data = await response.json();
      if (response.ok) setProfiles(data.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setProfiles(null);
    setSessionCode("");
    setCode("");
    setError("");
  };

  if (!profiles) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-[#f4f7fb] text-slate-900">
        <div className="mx-auto flex max-w-lg flex-col px-4 py-12 md:px-6 md:py-16">
          <div className="mb-10 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f1f4b]">
              Accès restreint
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-tight text-[#0f1f4b] sm:text-4xl md:text-5xl">
              Tableau de bord
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-600">
              Entrez votre code d&apos;accès pour consulter les profils de
              parrainage.
            </p>
          </div>

          <div className="rounded-sm border border-slate-200/90 bg-white p-8 shadow-[0_1px_3px_rgba(15,31,75,0.06)]">
            <h2 className="font-display text-xl font-bold uppercase text-[#0f1f4b] md:text-2xl">
              Connexion
            </h2>
            <p className="mt-2 text-[13px] leading-snug text-slate-600">
              Code d&apos;accès administrateur fourni par Nova Net.
            </p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  Code d&apos;accès
                </label>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-sm border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#0f1f4b]"
                />
              </div>

              {error && (
                <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-institutional-primary w-full rounded-sm disabled:opacity-60"
              >
                {isLoading ? "Connexion…" : "Accéder au tableau de bord"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-[#f4f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
        <header className="mb-10 flex flex-col gap-6 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f1f4b]">
              Administration
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-tight text-[#0f1f4b] md:text-4xl">
              Tableau de bord
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
              <span className="inline-flex items-center rounded-sm bg-[#0f1f4b]/[0.07] px-2.5 py-0.5 font-semibold text-[#0f1f4b]">
                {profiles.length}
              </span>
              <span className="ml-2">
                profil{profiles.length !== 1 ? "s" : ""} de parrainage
                enregistré{profiles.length !== 1 ? "s" : ""}.
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="rounded-sm border border-[#0f1f4b] bg-white px-5 py-2.5 text-sm font-semibold text-[#0f1f4b] transition-colors hover:bg-[#0f1f4b]/5 disabled:opacity-60"
            >
              {isLoading ? "Chargement…" : "Actualiser"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-sm border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-[#0f1f4b]"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {profiles.length === 0 ? (
          <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-600">
              Aucun profil de parrainage pour l&apos;instant.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,31,75,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90">
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] md:px-5">
                      Nom
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] md:px-5">
                      Code
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] md:px-5">
                      Parrainages
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] md:px-5">
                      Récompense
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] md:px-5">
                      Lien
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] md:px-5">
                      Créé le
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile, i) => (
                    <tr
                      key={profile.id}
                      className={
                        i % 2 === 0
                          ? "border-b border-slate-100 bg-white"
                          : "border-b border-slate-100 bg-slate-50/50"
                      }
                    >
                      <td className="px-4 py-3.5 font-semibold text-[#0f1f4b] md:px-5">
                        {profile.full_name}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600 md:px-5">
                        {profile.referral_code}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 md:px-5">
                        {profile.referral_count}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 md:px-5">
                        {profile.reward_percent}%
                      </td>
                      <td className="px-4 py-3.5 md:px-5">
                        <a
                          href={`${origin}/r/${profile.referral_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-[#0f1f4b] underline-offset-2 hover:underline"
                        >
                          {origin}/r/{profile.referral_code}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 md:px-5">
                        {new Date(profile.created_at).toLocaleDateString(
                          "fr-CA",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
