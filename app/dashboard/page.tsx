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

  if (!profiles) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-8 py-14 md:px-16">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2563eb]">
              Accès restreint
            </p>
            <h1 className="max-w-4xl font-display text-4xl font-bold uppercase leading-[0.95] text-[#0f1f4b] md:text-6xl">
              Tableau de bord
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-gray-600">
              Entrez votre code d&apos;accès pour consulter les profils de parrainage.
            </p>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-14">
          <div className="mx-auto max-w-7xl px-8 md:px-16">
            <div className="max-w-md border border-gray-200 bg-white p-7 shadow-sm">
              <h2 className="font-display text-2xl font-bold uppercase text-[#0f1f4b]">
                Connexion
              </h2>
              <p className="mt-2 text-[13px] text-gray-600">
                Entrez le code d&apos;accès administrateur.
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                    Code d&apos;accès
                  </label>
                  <input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#2563eb]"
                  />
                </div>

                {error && (
                  <div className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Connexion…" : "Accéder au tableau de bord"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-8 py-14 md:px-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2563eb]">
            Administration
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="max-w-4xl font-display text-4xl font-bold uppercase leading-[0.95] text-[#0f1f4b] md:text-6xl">
                Tableau de bord
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-gray-600">
                {profiles.length} profil{profiles.length !== 1 ? "s" : ""} de
                parrainage enregistré{profiles.length !== 1 ? "s" : ""}.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="border border-[#0f1f4b] bg-white px-5 py-2.5 text-sm font-semibold text-[#0f1f4b] transition-colors hover:border-[#2563eb] hover:text-[#2563eb] disabled:opacity-60"
            >
              {isLoading ? "Chargement…" : "Actualiser"}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-14">
        <div className="mx-auto max-w-7xl px-8 md:px-16">
          {profiles.length === 0 ? (
            <div className="border border-gray-200 bg-white p-7 shadow-sm">
              <p className="text-sm text-gray-500">
                Aucun profil de parrainage pour l&apos;instant.
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#f8fafc]">
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                        Nom
                      </th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                        Code
                      </th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                        Parrainages
                      </th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                        Récompense
                      </th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                        Lien
                      </th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
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
                            ? "border-b border-gray-100 bg-white"
                            : "border-b border-gray-100 bg-[#f8fafc]"
                        }
                      >
                        <td className="px-5 py-3.5 font-semibold text-[#0f1f4b]">
                          {profile.full_name}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                          {profile.referral_code}
                        </td>
                        <td className="px-5 py-3.5 text-slate-700">
                          {profile.referral_count}
                        </td>
                        <td className="px-5 py-3.5 text-slate-700">
                          {profile.reward_percent}%
                        </td>
                        <td className="px-5 py-3.5">
                          <a
                            href={`${origin}/r/${profile.referral_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-[#2563eb] underline-offset-2 hover:underline"
                          >
                            {origin}/r/{profile.referral_code}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
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
      </section>
    </main>
  );
}
