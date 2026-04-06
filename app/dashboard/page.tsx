"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ── Types ────────────────────────────────────────────────────────────────────

type JobStatus = "submitted" | "quoting" | "in_progress" | "completed";

type Job = {
  id: string;
  client_id: string | null;
  potential_client_id?: string | null;
  job_type: string;
  status: string;
  description?: string | null;
  created_at: string;
  // Joined from potential_clients table
  potential_clients?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
  } | null;
  // Joined from clients table (for jobs created directly from a client)
  clients?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
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
  // Joined from referral_profiles table
  referral_profiles?: {
    full_name: string;
    referral_code: string;
    reward_percent: number;
  } | null;
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

// ── i18n ─────────────────────────────────────────────────────────────────────

const T = {
  fr: {
    restricted: "Accès restreint",
    dashboard: "Tableau de bord",
    loginDesc: "Entrez votre code d'accès administrateur.",
    login: "Connexion",
    loginHint: "Code d'accès administrateur fourni par Nova Net.",
    accessCode: "Code d'accès",
    connecting: "Connexion…",
    access: "Accéder au tableau de bord",
    invalidCode: "Code invalide. Veuillez réessayer.",
    connError: "Erreur de connexion. Veuillez réessayer.",
    administration: "Administration",
    refresh: "Actualiser",
    loading: "…",
    logout: "Déconnexion",
    tabJobs: "Travaux",
    tabProspects: "Prospects",
    tabClients: "Clients",
    tabReferrals: "Parrainages",
    filterAll: "Tous",
    filterSubmitted: "Demande",
    filterQuoting: "En devis",
    filterInProgress: "En cours",
    filterCompleted: "Complété",
    noJobs: "Aucun travail.",
    noProspects: "Aucun prospect.",
    noClients: "Aucun client.",
    noReferrals: "Aucun profil de parrainage.",
    chargement: "Chargement…",
    type: "Type",
    contact: "Contact",
    description: "Description",
    status: "Statut",
    changeStatus: "Changer statut",
    createdAt: "Créé le",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    message: "Message",
    referredBy: "Parrainé par",
    actions: "Actions",
    toClient: "→ Client",
    address: "Adresse",
    nbJobs: "Nb travaux",
    code: "Code",
    referrals: "Parrainages",
    reward: "Récompense",
    link: "Lien",
    convertTitle: "Convertir en client",
    fullName: "Nom complet",
    confirm: "Confirmer",
    converting: "Conversion…",
    cancel: "Annuler",
    nameAddressRequired: "Nom et adresse requis.",
    convertError: "Erreur lors de la conversion.",
    addJobTitle: "Ajouter un travail",
    jobType: "Type de travail",
    addJob: "Ajouter",
    addingJob: "Ajout…",
    jobTypeRequired: "Type de travail requis.",
    addJobError: "Erreur lors de l'ajout.",
    jobTypes: [
      "Lavage de Vitres",
      "Lavage à Pression",
      "Scellant de Pavés",
      "Nettoyage en profondeur",
      "Sablage",
      "Finition détaillée",
      "Autre",
    ],
  },
  en: {
    restricted: "Restricted Access",
    dashboard: "Dashboard",
    loginDesc: "Enter your admin access code.",
    login: "Login",
    loginHint: "Admin access code provided by Nova Net.",
    accessCode: "Access code",
    connecting: "Connecting…",
    access: "Access dashboard",
    invalidCode: "Invalid code. Please try again.",
    connError: "Connection error. Please try again.",
    administration: "Administration",
    refresh: "Refresh",
    loading: "…",
    logout: "Logout",
    tabJobs: "Jobs",
    tabProspects: "Prospects",
    tabClients: "Clients",
    tabReferrals: "Referrals",
    filterAll: "All",
    filterSubmitted: "Request",
    filterQuoting: "Quoting",
    filterInProgress: "In Progress",
    filterCompleted: "Completed",
    noJobs: "No jobs.",
    noProspects: "No prospects.",
    noClients: "No clients.",
    noReferrals: "No referral profiles.",
    chargement: "Loading…",
    type: "Type",
    contact: "Contact",
    description: "Description",
    status: "Status",
    changeStatus: "Change status",
    createdAt: "Created",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    referredBy: "Referred by",
    actions: "Actions",
    toClient: "→ Client",
    address: "Address",
    nbJobs: "# Jobs",
    code: "Code",
    referrals: "Referrals",
    reward: "Reward",
    link: "Link",
    convertTitle: "Convert to client",
    fullName: "Full name",
    confirm: "Confirm",
    converting: "Converting…",
    cancel: "Cancel",
    nameAddressRequired: "Name and address required.",
    convertError: "Error during conversion.",
    addJobTitle: "Add a job",
    jobType: "Job type",
    addJob: "Add",
    addingJob: "Adding…",
    jobTypeRequired: "Job type required.",
    addJobError: "Error adding job.",
    jobTypes: [
      "Window Washing",
      "Pressure Washing",
      "Paver Sealing",
      "Deep Cleaning",
      "Sandblasting",
      "Detailed Finish",
      "Other",
    ],
  },
} as const;

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700 border border-blue-200",
  quoting: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  in_progress: "bg-orange-50 text-orange-700 border border-orange-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
};

function statusLabel(status: string, lang: "fr" | "en") {
  const map: Record<string, { fr: string; en: string }> = {
    submitted: { fr: "Demande", en: "Request" },
    quoting: { fr: "En devis", en: "Quoting" },
    in_progress: { fr: "En cours", en: "In Progress" },
    completed: { fr: "Complété", en: "Completed" },
  };
  return map[status]?.[lang] ?? status;
}

function Badge({ status, lang }: { status: string; lang: "fr" | "en" }) {
  const style = STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600 border border-slate-200";
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${style}`}>
      {statusLabel(status, lang)}
    </span>
  );
}

function StatusSelect({
  value,
  lang,
  onChange,
}: {
  value: string;
  lang: "fr" | "en";
  onChange: (v: string) => void;
}) {
  const t = T[lang];
  const options: { value: JobStatus; label: string }[] = [
    { value: "submitted", label: t.filterSubmitted },
    { value: "quoting", label: t.filterQuoting },
    { value: "in_progress", label: t.filterInProgress },
    { value: "completed", label: t.filterCompleted },
  ];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-[#0f1f4b] focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { lang } = useLanguage();
  const t = T[lang];

  const [code, setCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("jobs");

  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [referrals, setReferrals] = useState<ReferralProfile[] | null>(null);

  const [jobFilter, setJobFilter] = useState<JobStatus | "all">("all");
  const [prospectFilter, setProspectFilter] = useState<JobStatus | "all">("all");

  // Convert-to-client modal
  const [converting, setConverting] = useState<Prospect | null>(null);
  const [convertName, setConvertName] = useState("");
  const [convertAddress, setConvertAddress] = useState("");
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState("");

  // Add-job modal
  const [addingJobFor, setAddingJobFor] = useState<Client | null>(null);
  const [addJobType, setAddJobType] = useState("");
  const [addJobStatus, setAddJobStatus] = useState<JobStatus>("quoting");
  const [addJobDesc, setAddJobDesc] = useState("");
  const [addJobLoading, setAddJobLoading] = useState(false);
  const [addJobError, setAddJobError] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // ── Auth helpers ──────────────────────────────────────────────────────────

  const authedFetch = useCallback(
    (input: RequestInfo, init?: RequestInit) =>
      fetch(input, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionCode}`,
          ...(init?.headers ?? {}),
        },
      }),
    [sessionCode],
  );

  // ── Login ─────────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/dashboard?action=jobs", {
        headers: { Authorization: `Bearer ${code}` },
      });
      if (!res.ok) { setLoginError(t.invalidCode); return; }
      const data = await res.json();
      setJobs(data.data ?? []);
      setSessionCode(code);
    } catch {
      setLoginError(t.connError);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadTab = useCallback(
    async (tab: Tab) => {
      setIsLoading(true);
      try {
        const actionMap: Record<Tab, string> = {
          jobs: "jobs",
          prospects: "potential_clients",
          clients: "clients",
          referrals: "referrals",
        };
        const res = await authedFetch(`/api/dashboard?action=${actionMap[tab]}`);
        const data = await res.json();
        if (tab === "jobs") setJobs(data.data ?? []);
        else if (tab === "prospects") setProspects(data.data ?? []);
        else if (tab === "clients") setClients(data.data ?? []);
        else if (tab === "referrals") setReferrals(data.data ?? []);
      } catch {
        /* keep stale data */
      } finally {
        setIsLoading(false);
      }
    },
    [authedFetch],
  );

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    // Always reload on tab switch so counts and statuses stay fresh
    loadTab(tab);
  };

  // ── Status updates ────────────────────────────────────────────────────────

  const updateJobStatus = async (id: string, status: string) => {
    setJobs((prev) => prev?.map((j) => j.id === id ? { ...j, status } : j) ?? null);
    await authedFetch("/api/dashboard", {
      method: "PATCH",
      body: JSON.stringify({ type: "job", id, status }),
    }).catch(() => loadTab("jobs"));
  };

  const updateProspectStatus = async (id: string, status: string) => {
    setProspects((prev) => prev?.map((p) => p.id === id ? { ...p, status } : p) ?? null);
    await authedFetch("/api/dashboard", {
      method: "PATCH",
      body: JSON.stringify({ type: "prospect", id, status }),
    }).catch(() => loadTab("prospects"));
  };

  // ── Convert to client ─────────────────────────────────────────────────────

  const openConvert = (p: Prospect) => {
    setConverting(p);
    setConvertName(`${p.first_name} ${p.last_name}`);
    setConvertAddress("");
    setConvertError("");
  };

  const submitConvert = async () => {
    if (!converting || !convertName.trim() || !convertAddress.trim()) {
      setConvertError(t.nameAddressRequired);
      return;
    }
    setConvertLoading(true);
    setConvertError("");
    try {
      const res = await authedFetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({
          action: "convert_client",
          potentialClientId: converting.id,
          name: convertName,
          address: convertAddress,
        }),
      });
      if (!res.ok) throw new Error();
      setProspects((prev) => prev?.filter((p) => p.id !== converting.id) ?? null);
      setClients(null); // force reload
      setConverting(null);
    } catch {
      setConvertError(t.convertError);
    } finally {
      setConvertLoading(false);
    }
  };

  // ── Add job ───────────────────────────────────────────────────────────────

  const openAddJob = (c: Client) => {
    setAddingJobFor(c);
    setAddJobType(t.jobTypes[0]);
    setAddJobStatus("quoting");
    setAddJobDesc("");
    setAddJobError("");
  };

  const submitAddJob = async () => {
    if (!addingJobFor || !addJobType.trim()) {
      setAddJobError(t.jobTypeRequired);
      return;
    }
    setAddJobLoading(true);
    setAddJobError("");
    try {
      const res = await authedFetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({
          action: "add_job",
          clientId: addingJobFor.id,
          jobType: addJobType,
          jobStatus: addJobStatus,
          description: addJobDesc || null,
        }),
      });
      if (!res.ok) throw new Error();
      // Refresh both tabs
      setClients(null);
      setJobs(null);
      if (activeTab === "clients") loadTab("clients");
      else if (activeTab === "jobs") loadTab("jobs");
      setAddingJobFor(null);
    } catch {
      setAddJobError(t.addJobError);
    } finally {
      setAddJobLoading(false);
    }
  };

  // ── Filtered data ─────────────────────────────────────────────────────────

  const filteredJobs = jobFilter === "all" ? jobs : jobs?.filter((j) => j.status === jobFilter);
  const filteredProspects = prospectFilter === "all" ? prospects : prospects?.filter((p) => p.status === prospectFilter);

  const statusFilters = [
    { value: "all" as const, label: t.filterAll },
    { value: "submitted" as const, label: t.filterSubmitted },
    { value: "quoting" as const, label: t.filterQuoting },
    { value: "in_progress" as const, label: t.filterInProgress },
    { value: "completed" as const, label: t.filterCompleted },
  ];

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!sessionCode) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-[#f4f7fb] text-slate-900">
        <div className="mx-auto flex max-w-lg flex-col px-4 py-12 md:px-6 md:py-16">
          <div className="mb-10 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f1f4b]">
              {t.restricted}
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-tight text-[#0f1f4b] sm:text-4xl md:text-5xl">
              {t.dashboard}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-600">
              {t.loginDesc}
            </p>
          </div>
          <div className="rounded-sm border border-slate-200/90 bg-white p-8 shadow-[0_1px_3px_rgba(15,31,75,0.06)]">
            <h2 className="font-display text-xl font-bold uppercase text-[#0f1f4b] md:text-2xl">
              {t.login}
            </h2>
            <p className="mt-2 text-[13px] leading-snug text-slate-600">{t.loginHint}</p>
            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {t.accessCode}
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
              {loginError && (
                <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-institutional-primary w-full rounded-sm disabled:opacity-60"
              >
                {isLoading ? t.connecting : t.access}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  const tabs: { key: Tab; label: string }[] = [
    { key: "jobs", label: t.tabJobs },
    { key: "prospects", label: t.tabProspects },
    { key: "clients", label: t.tabClients },
    { key: "referrals", label: t.tabReferrals },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-[#f4f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f1f4b]">
              {t.administration}
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-tight text-[#0f1f4b] md:text-4xl">
              {t.dashboard}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => loadTab(activeTab)}
              disabled={isLoading}
              className="rounded-sm border border-[#0f1f4b] bg-white px-4 py-2 text-sm font-semibold text-[#0f1f4b] transition-colors hover:bg-[#0f1f4b]/5 disabled:opacity-60"
            >
              {isLoading ? t.loading : t.refresh}
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
              {t.logout}
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => switchTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-[#0f1f4b] text-[#0f1f4b]"
                  : "text-slate-500 hover:text-[#0f1f4b]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── JOBS TAB ── */}
        {activeTab === "jobs" && (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {statusFilters.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setJobFilter(s.value)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    jobFilter === s.value
                      ? "bg-[#0f1f4b] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#0f1f4b] hover:text-[#0f1f4b]"
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

            {jobs === null ? (
              <p className="py-10 text-center text-sm text-slate-500">{t.chargement}</p>
            ) : filteredJobs?.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">{t.noJobs}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {[t.contact, t.type, t.description, t.status, t.changeStatus, t.createdAt].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs?.map((job, i) => (
                        <tr key={job.id} className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}>
                          <td className="px-4 py-3">
                            {job.potential_clients ? (
                              <div>
                                <p className="font-semibold text-[#0f1f4b]">
                                  {job.potential_clients.first_name} {job.potential_clients.last_name}
                                </p>
                                <p className="text-[11px] text-slate-400">{job.potential_clients.email}</p>
                              </div>
                            ) : job.clients ? (
                              <div>
                                <p className="font-semibold text-[#0f1f4b]">{job.clients.name}</p>
                                {job.clients.email && (
                                  <p className="text-[11px] text-slate-400">{job.clients.email}</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-[#0f1f4b]">{job.job_type}</td>
                          <td className="max-w-[160px] truncate px-4 py-3 text-slate-600">{job.description ?? "—"}</td>
                          <td className="px-4 py-3"><Badge status={job.status} lang={lang} /></td>
                          <td className="px-4 py-3">
                            <StatusSelect value={job.status} lang={lang} onChange={(v) => updateJobStatus(job.id, v)} />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                            {new Date(job.created_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
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
            <div className="mb-4 flex flex-wrap gap-2">
              {statusFilters.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setProspectFilter(s.value)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    prospectFilter === s.value
                      ? "bg-[#0f1f4b] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#0f1f4b] hover:text-[#0f1f4b]"
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

            {prospects === null ? (
              <p className="py-10 text-center text-sm text-slate-500">{t.chargement}</p>
            ) : filteredProspects?.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">{t.noProspects}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {[t.name, t.email, t.phone, t.message, t.referredBy, t.status, t.changeStatus, t.actions].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProspects?.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}>
                          <td className="px-4 py-3 font-semibold text-[#0f1f4b]">
                            {p.first_name} {p.last_name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{p.email}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-600">{p.phone ?? "—"}</td>
                          <td className="max-w-[160px] truncate px-4 py-3 text-slate-500">{p.message ?? "—"}</td>
                          <td className="px-4 py-3">
                            {p.referral_profiles ? (
                              <div>
                                <p className="font-medium text-teal-700">{p.referral_profiles.full_name}</p>
                                <p className="text-[11px] text-slate-400">
                                  {p.referral_profiles.referral_code}
                                  {!!p.referral_discount_percent && (
                                    <span className="ml-1.5 text-teal-600">· -{p.referral_discount_percent}%</span>
                                  )}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3"><Badge status={p.status ?? "submitted"} lang={lang} /></td>
                          <td className="px-4 py-3">
                            <StatusSelect value={p.status ?? "submitted"} lang={lang} onChange={(v) => updateProspectStatus(p.id, v)} />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => openConvert(p)}
                              className="whitespace-nowrap rounded border border-[#0f1f4b] px-2.5 py-1 text-[11px] font-semibold text-[#0f1f4b] transition-colors hover:bg-[#0f1f4b] hover:text-white"
                            >
                              {t.toClient}
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
            {clients === null ? (
              <p className="py-10 text-center text-sm text-slate-500">{t.chargement}</p>
            ) : clients.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">{t.noClients}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {[t.name, t.address, t.email, t.phone, t.nbJobs, t.createdAt, t.actions].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((c, i) => (
                        <tr key={c.id} className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}>
                          <td className="px-4 py-3 font-semibold text-[#0f1f4b]">{c.name}</td>
                          <td className="px-4 py-3 text-slate-600">{c.address}</td>
                          <td className="px-4 py-3 text-slate-600">{c.email ?? "—"}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-600">{c.phone ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{c.number_of_jobs}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                            {new Date(c.created_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => openAddJob(c)}
                              className="whitespace-nowrap rounded border border-[#0f1f4b] px-2.5 py-1 text-[11px] font-semibold text-[#0f1f4b] transition-colors hover:bg-[#0f1f4b] hover:text-white"
                            >
                              + {t.tabJobs}
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

        {/* ── REFERRALS TAB ── */}
        {activeTab === "referrals" && (
          <div>
            {referrals === null ? (
              <p className="py-10 text-center text-sm text-slate-500">{t.chargement}</p>
            ) : referrals.length === 0 ? (
              <div className="rounded-xl border border-slate-200/90 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">{t.noReferrals}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90">
                        {[t.name, t.code, t.referrals, t.reward, t.link, t.createdAt].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((r, i) => (
                        <tr key={r.id} className={i % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/50"}>
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
                            {new Date(r.created_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
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
            <h2 className="font-display text-lg font-bold uppercase text-[#0f1f4b]">{t.convertTitle}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {converting.first_name} {converting.last_name} · {converting.email}
            </p>
            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {t.fullName}
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
                  {t.address}
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
            {convertError && <p className="mt-3 text-sm text-red-600">{convertError}</p>}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={submitConvert}
                disabled={convertLoading}
                className="btn-institutional-primary flex-1 disabled:opacity-60"
              >
                {convertLoading ? t.converting : t.confirm}
              </button>
              <button
                type="button"
                onClick={() => setConverting(null)}
                className="flex-1 rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-400"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add job modal ── */}
      {addingJobFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setAddingJobFor(null); }}
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold uppercase text-[#0f1f4b]">{t.addJobTitle}</h2>
            <p className="mt-1 text-sm text-slate-500">{addingJobFor.name}</p>
            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {t.jobType}
                </label>
                <select
                  value={addJobType}
                  onChange={(e) => setAddJobType(e.target.value)}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0f1f4b]"
                >
                  {t.jobTypes.map((jt) => (
                    <option key={jt} value={jt}>{jt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {t.status}
                </label>
                <select
                  value={addJobStatus}
                  onChange={(e) => setAddJobStatus(e.target.value as JobStatus)}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0f1f4b]"
                >
                  <option value="quoting">{t.filterQuoting}</option>
                  <option value="in_progress">{t.filterInProgress}</option>
                  <option value="completed">{t.filterCompleted}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {t.description}
                </label>
                <textarea
                  value={addJobDesc}
                  onChange={(e) => setAddJobDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0f1f4b]"
                />
              </div>
            </div>
            {addJobError && <p className="mt-3 text-sm text-red-600">{addJobError}</p>}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={submitAddJob}
                disabled={addJobLoading}
                className="btn-institutional-primary flex-1 disabled:opacity-60"
              >
                {addJobLoading ? t.addingJob : t.addJob}
              </button>
              <button
                type="button"
                onClick={() => setAddingJobFor(null)}
                className="flex-1 rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-400"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
