"use client";

import { useState, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type JobStatus = "submitted" | "quoting" | "in_progress" | "completed";

type Job = {
  id: string;
  client_id: string | null;
  potential_client_id?: string | null;
  job_type: string;
  status: string;
  description?: string | null;
  scheduled_date?: string | null;
  completed_date?: string | null;
  created_at: string;
};

type Prospect = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  status: string;
  referral_discount_percent?: number | null;
  created_at: string;
};

type Client = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  number_of_jobs: number;
  created_at: string;
};

type ReferralProfile = {
  id: string;
  full_name: string;
  referral_code: string;
  referral_count: number;
  reward_percent: number;
  created_at: string;
};

type Tab = "jobs" | "prospects" | "clients" | "referrals";

// ── Constants ────────────────────────────────────────────────────────────────

const STATUSES: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "submitted", label: "Soumis" },
  { value: "quoting", label: "En devis" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Complété" },
];

const STATUS_STYLE: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700 border border-blue-200",
  quoting: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  in_progress: "bg-orange-50 text-orange-700 border border-orange-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Soumis",
  quoting: "En devis",
  in_progress: "En cours",
  completed: "Complété",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600 border border-slate-200";
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${style}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-[#0f1f4b] focus:outline-none disabled:opacity-50"
    >
      {STATUSES.filter((s) => s.value !== "all").map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("jobs");

  // Data per tab
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [referrals, setReferrals] = useState<ReferralProfile[] | null>(null);

  // Filter state
  const [jobFilter, setJobFilter] = useState<JobStatus | "all">("all");
  const [prospectFilter, setProspectFilter] = useState<JobStatus | "all">("all");

  // Convert-to-client modal state
  const [converting, setConverting] = useState<Prospect | null>(null);
  const [convertName, setConvertName] = useState("");
  const [convertAddress, setConvertAddress] = useState("");
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // ── Auth ──────────────────────────────────────────────────────────────────

  const apiFetch = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      const res = await fetch(input, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionCode || code}`,
          ...(init?.headers ?? {}),
        },
      });
      return res;
    },
    [sessionCode, code],
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard?action=jobs", {
        headers: { Authorization: `Bearer ${code}` },
      });
      if (!res.ok) { setError("Code invalide. Veuillez réessayer."); return; }
      const data = await res.json();
      setJobs(data.data);
      setSessionCode(code);
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadTab = useCallback(
    async (tab: Tab) => {
      setIsLoading(true);
      try {
        if (tab === "jobs") {
          const res = await apiFetch("/api/dashboard?action=jobs");
          const data = await res.json();
          setJobs(data.data);
        } else if (tab === "prospects") {
          const res = await apiFetch("/api/dashboard?action=potential_clients");
          const data = await res.json();
          setProspects(data.data);
        } else if (tab === "clients") {
          const res = await apiFetch("/api/dashboard?action=clients");
          const data = await res.json();
          setClients(data.data);
        } else if (tab === "referrals") {
          const res = await apiFetch("/api/dashboard?action=referrals");
          const data = await res.json();
          setReferrals(data.data);
        }
      } catch {
        // silently fail — stale data stays
      } finally {
        setIsLoading(false);
      }
    },
    [apiFetch],
  );

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    // Only fetch if data not yet loaded
    if (tab === "jobs" && jobs === null) loadTab(tab);
    else if (tab === "prospects" && prospects === null) loadTab(tab);
    else if (tab === "clients" && clients === null) loadTab(tab);
    else if (tab === "referrals" && referrals === null) loadTab(tab);
  };

  // ── Status update ─────────────────────────────────────────────────────────

  const updateJobStatus = async (jobId: string, status: string) => {
    setJobs((prev) =>
      prev ? prev.map((j) => (j.id === jobId ? { ...j, status } : j)) : prev,
    );
    try {
      await apiFetch("/api/dashboard", {
        method: "PATCH",
        body: JSON.stringify({ type: "job", id: jobId, status }),
      });
    } catch {
      // revert on failure by re-loading
      loadTab("jobs");
    }
  };

  const updateProspectStatus = async (id: string, status: string) => {
    setProspects((prev) =>
      prev ? prev.map((p) => (p.id === id ? { ...p, status } : p)) : prev,
    );
    try {
      await apiFetch("/api/dashboard", {
        method: "PATCH",
        body: JSON.stringify({ type: "prospect", id, status }),
      });
    } catch {
      loadTab("prospects");
    }
  };

  // ── Convert to client ─────────────────────────────────────────────────────

  const openConvert = (prospect: Prospect) => {
    setConverting(prospect);
    setConvertName(`${prospect.first_name} ${prospect.last_name}`);
    setConvertAddress("");
    setConvertError("");
  };

  const submitConvert = async () => {
    if (!converting || !convertName.trim() || !convertAddress.trim()) {
      setConvertError("Nom et adresse requis.");
      return;
    }
    setConvertLoading(true);
    setConvertError("");
    try {
      const res = await apiFetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({
          action: "convert_client",
          potentialClientId: converting.id,
          name: convertName,
          address: convertAddress,
        }),
      });
      if (!res.ok) throw new Error();
      // Remove from prospects, force reload of clients
      setProspects((prev) => prev?.filter((p) => p.id !== converting.id) ?? null);
      setClients(null); // will reload on next visit
      setConverting(null);
    } catch {
      setConvertError("Erreur lors de la conversion.");
    } finally {
      setConvertLoading(false);
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const filteredJobs =
    jobFilter === "all" ? jobs : jobs?.filter((j) => j.status === jobFilter);

  const filteredProspects =
    prospectFilter === "all"
      ? prospects
      : prospects?.filter((p) => p.status === prospectFilter);

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!sessionCode) {
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
              Entrez votre code d&apos;accès administrateur.
            </p>
          </div>

          <div className="rounded-sm border border-slate-200/90 bg-white p-8 shadow-[0_1px_3px_rgba(15,31,75,0.06)]">
            <h2 className="font-display text-xl font-bold uppercase text-[#0f1f4b] md:text-2xl">
              Connexion
            </h2>
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

  // ── Dashboard ─────────────────────────────────────────────────────────────

  const tabs: { key: Tab; label: string }[] = [
    { key: "jobs", label: "Demandes" },
    { key: "prospects", label: "Prospects" },
    { key: "clients", label: "Clients" },
    { key: "referrals", label: "Parrainages" },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-[#f4f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f1f4b]">
              Administration
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-tight text-[#0f1f4b] md:text-4xl">
              Tableau de bord
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => loadTab(activeTab)}
              disabled={isLoading}
              className="rounded-sm border border-[#0f1f4b] bg-white px-4 py-2 text-sm font-semibold text-[#0f1f4b] transition-colors hover:bg-[#0f1f4b]/5 disabled:opacity-60"
            >
              {isLoading ? "…" : "Actualiser"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSessionCode("");
                setCode("");
                setJobs(null);
                setProspects(null);
                setClients(null);
                setReferrals(null);
              }}
              className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => switchTab(t.key)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === t.key
                  ? "border-b-2 border-[#0f1f4b] text-[#0f1f4b]"
                  : "text-slate-500 hover:text-[#0f1f4b]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── JOBS TAB ── */}
        {activeTab === "jobs" && (
          <div>
            {/* Status filter */}
            <div className="mb-4 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setJobFilter(s.value as JobStatus | "all")}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    jobFilter === s.value
                      ? "bg-[#0f1f4b] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-[#0f1f4b] hover:text-[#0f1f4b]"
                  }`}
                >
                  {s.label}
                  {s.value !== "all" && jobs && (
                    <span className="ml-1.5 opacity-70">
                      ({jobs.filter((j) => j.status === s.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {!jobs ? (
              <p className="py-10 text-center text-sm text-slate-500">Chargement…</p>
            ) : filteredJobs?.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">Aucune demande.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {["Type", "Description", "Statut", "Changer statut", "Créé le"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs?.map((job, i) => (
                        <tr
                          key={job.id}
                          className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}
                        >
                          <td className="px-4 py-3 font-medium text-[#0f1f4b]">{job.job_type}</td>
                          <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">
                            {job.description ?? "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge status={job.status} />
                          </td>
                          <td className="px-4 py-3">
                            <StatusSelect
                              value={job.status}
                              onChange={(v) => updateJobStatus(job.id, v)}
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                            {new Date(job.created_at).toLocaleDateString("fr-CA")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROSPECTS TAB ── */}
        {activeTab === "prospects" && (
          <div>
            {/* Status filter */}
            <div className="mb-4 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setProspectFilter(s.value as JobStatus | "all")}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    prospectFilter === s.value
                      ? "bg-[#0f1f4b] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-[#0f1f4b] hover:text-[#0f1f4b]"
                  }`}
                >
                  {s.label}
                  {s.value !== "all" && prospects && (
                    <span className="ml-1.5 opacity-70">
                      ({prospects.filter((p) => p.status === s.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {!prospects ? (
              <p className="py-10 text-center text-sm text-slate-500">Chargement…</p>
            ) : filteredProspects?.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">Aucun prospect.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {["Nom", "Email", "Téléphone", "Message", "Statut", "Changer statut", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProspects?.map((p, i) => (
                        <tr
                          key={p.id}
                          className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}
                        >
                          <td className="px-4 py-3 font-semibold text-[#0f1f4b]">
                            {p.first_name} {p.last_name}
                            {p.referral_discount_percent && (
                              <span className="ml-1.5 rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">
                                -{p.referral_discount_percent}%
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{p.email}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-600">{p.phone ?? "—"}</td>
                          <td className="max-w-[180px] truncate px-4 py-3 text-slate-500">{p.message ?? "—"}</td>
                          <td className="px-4 py-3">
                            <Badge status={p.status ?? "submitted"} />
                          </td>
                          <td className="px-4 py-3">
                            <StatusSelect
                              value={p.status ?? "submitted"}
                              onChange={(v) => updateProspectStatus(p.id, v)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => openConvert(p)}
                              className="whitespace-nowrap rounded border border-[#0f1f4b] px-2.5 py-1 text-[11px] font-semibold text-[#0f1f4b] transition-colors hover:bg-[#0f1f4b] hover:text-white"
                            >
                              → Client
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CLIENTS TAB ── */}
        {activeTab === "clients" && (
          <div>
            {!clients ? (
              <p className="py-10 text-center text-sm text-slate-500">Chargement…</p>
            ) : clients.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">Aucun client.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {["Nom", "Adresse", "Email", "Téléphone", "Nb travaux", "Créé le"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((c, i) => (
                        <tr
                          key={c.id}
                          className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}
                        >
                          <td className="px-4 py-3 font-semibold text-[#0f1f4b]">{c.name}</td>
                          <td className="px-4 py-3 text-slate-600">{c.address}</td>
                          <td className="px-4 py-3 text-slate-600">{c.email ?? "—"}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-600">{c.phone ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{c.number_of_jobs}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                            {new Date(c.created_at).toLocaleDateString("fr-CA")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── REFERRALS TAB ── */}
        {activeTab === "referrals" && (
          <div>
            {!referrals ? (
              <p className="py-10 text-center text-sm text-slate-500">Chargement…</p>
            ) : referrals.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">Aucun profil de parrainage.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {["Nom", "Code", "Parrainages", "Récompense", "Lien", "Créé le"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((r, i) => (
                        <tr
                          key={r.id}
                          className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}
                        >
                          <td className="px-4 py-3 font-semibold text-[#0f1f4b]">{r.full_name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.referral_code}</td>
                          <td className="px-4 py-3 text-slate-700">{r.referral_count}</td>
                          <td className="px-4 py-3 text-slate-700">{r.reward_percent}%</td>
                          <td className="px-4 py-3">
                            <a
                              href={`${origin}/r/${r.referral_code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-[#0f1f4b] underline-offset-2 hover:underline"
                            >
                              {origin}/r/{r.referral_code}
                            </a>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                            {new Date(r.created_at).toLocaleDateString("fr-CA")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Convert to client modal ── */}
      {converting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setConverting(null); }}
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold uppercase text-[#0f1f4b]">
              Convertir en client
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {converting.first_name} {converting.last_name} · {converting.email}
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={convertName}
                  onChange={(e) => setConvertName(e.target.value)}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0f1f4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  Adresse
                </label>
                <input
                  type="text"
                  value={convertAddress}
                  onChange={(e) => setConvertAddress(e.target.value)}
                  placeholder="123 Rue Principale, Montréal"
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0f1f4b]"
                />
              </div>
            </div>

            {convertError && (
              <p className="mt-3 text-sm text-red-600">{convertError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={submitConvert}
                disabled={convertLoading}
                className="btn-institutional-primary flex-1 disabled:opacity-60"
              >
                {convertLoading ? "Conversion…" : "Confirmer"}
              </button>
              <button
                type="button"
                onClick={() => setConverting(null)}
                className="flex-1 rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
