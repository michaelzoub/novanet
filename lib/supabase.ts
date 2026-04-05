import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.",
  );
}

if (!supabaseServiceRoleKey) {
  console.warn(
    "Supabase Service Role Key is missing. Please set SUPABASE_SERVICE_ROLE_KEY in your .env.local file for server-side operations.",
  );
}

// Client-side Supabase client (uses anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key, bypasses RLS)
// This should ONLY be used in API routes and server components
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database Types
export interface Client {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  current_job_id?: string | null;
  number_of_jobs: number;
  created_at: string;
  updated_at: string;
}

export type JobStatus = "submitted" | "quoting" | "in_progress" | "completed";

export interface Job {
  id: string;
  client_id: string | null;
  potential_client_id?: string | null;
  job_type: string;
  status: JobStatus | string;
  location: [number, number]; // [longitude, latitude]
  review?: string | null;
  rating?: number | null;
  description?: string | null;
  scheduled_date?: string | null;
  completed_date?: string | null;
  created_at: string;
  updated_at: string;
}

// Client operations
// These use supabaseAdmin (service role) to bypass RLS for server-side operations
export const clientManager = {
  // Get all clients
  async getAllClients() {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Client[];
  },

  // Get a single client by ID
  async getClientById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Client;
  },

  // Create a new client
  async createClient(
    client: Omit<Client, "id" | "created_at" | "updated_at" | "number_of_jobs">,
  ) {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .insert({
        ...client,
        number_of_jobs: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Client;
  },

  // Update a client
  async updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Client;
  },

  // Delete a client
  async deleteClient(id: string) {
    const { error } = await supabaseAdmin.from("clients").delete().eq("id", id);
    if (error) throw error;
  },

  // Increment job count for a client
  async incrementJobCount(clientId: string) {
    const { data, error } = await supabaseAdmin.rpc("increment_job_count", {
      client_id: clientId,
    });

    if (error) throw error;
    return data;
  },
};

// Job operations
// These use supabaseAdmin (service role) to bypass RLS for server-side operations
export const jobManager = {
  // Get all jobs
  async getAllJobs() {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Job[];
  },

  // Get jobs by client ID
  async getJobsByClientId(clientId: string) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Job[];
  },

  // Get completed jobs (for map display)
  async getCompletedJobs() {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .ilike("status", "%completed%")
      .order("completed_date", { ascending: false });

    if (error) throw error;
    return data as Job[];
  },

  // Get a single job by ID
  async getJobById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Job;
  },

  // Create a new job
  async createJob(job: Omit<Job, "id" | "created_at" | "updated_at">) {
    // Strip keys with null/undefined values so columns that may not exist yet
    // (e.g. potential_client_id before migration) don't cause insert errors.
    const payload = Object.fromEntries(
      Object.entries(job).filter(([, v]) => v !== null && v !== undefined),
    );

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    // Only link to client if client_id is provided — non-fatal so a missing
    // RPC function or constraint doesn't roll back the already-saved job.
    if (job.client_id) {
      try {
        await supabaseAdmin
          .from("clients")
          .update({
            current_job_id: data.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.client_id);

        await clientManager.incrementJobCount(job.client_id);
      } catch (e) {
        console.error("createJob: post-insert client update failed (non-fatal):", e);
      }
    }

    return data as Job;
  },

  // Get jobs by status
  async getJobsByStatus(status: string) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Job[];
  },

  // Update a job
  async updateJob(id: string, updates: Partial<Job>) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If job is completed, update client's current_job_id
    if (updates.status?.toLowerCase().includes("completed")) {
      const job = data as Job;
      await supabaseAdmin
        .from("clients")
        .update({
          current_job_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("current_job_id", id);
    }

    return data as Job;
  },

  // Delete a job
  async deleteJob(id: string) {
    const { error } = await supabaseAdmin.from("jobs").delete().eq("id", id);
    if (error) throw error;
  },
};

// Potential Client interface
export interface PotentialClient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  referred_by_referral_profile_id?: string | null;
  referral_discount_percent?: number | null;
  status: JobStatus | string;
  created_at: string;
  updated_at: string;
}

// Potential Client operations
// These use supabaseAdmin (service role) to bypass RLS for server-side operations
export const potentialClientManager = {
  // Create a new potential client
  async createPotentialClient(
    client: Omit<PotentialClient, "id" | "created_at" | "updated_at" | "status">,
  ) {
    const { data, error } = await supabaseAdmin
      .from("potential_clients")
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return data as PotentialClient;
  },

  // Get all potential clients
  async getAllPotentialClients() {
    const { data, error } = await supabaseAdmin
      .from("potential_clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as PotentialClient[];
  },

  // Get a potential client by ID
  async getPotentialClientById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("potential_clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as PotentialClient;
  },

  // Update status of a potential client
  async updateStatus(id: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from("potential_clients")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as PotentialClient;
  },

  // Convert a potential client to a real client
  async convertToClient(id: string, name: string, address: string) {
    const potClient = await potentialClientManager.getPotentialClientById(id);

    const newClient = await clientManager.createClient({
      name,
      address,
      phone: potClient.phone ?? undefined,
      email: potClient.email,
      current_job_id: null,
    });

    // Find and re-link any jobs that referenced this potential_client
    const { data: linkedJobs } = await supabaseAdmin
      .from("jobs")
      .select("id")
      .eq("potential_client_id", id);

    if (linkedJobs && linkedJobs.length > 0) {
      await supabaseAdmin
        .from("jobs")
        .update({ client_id: newClient.id, updated_at: new Date().toISOString() })
        .eq("potential_client_id", id);

      // Reflect the linked jobs in number_of_jobs
      await supabaseAdmin
        .from("clients")
        .update({ number_of_jobs: linkedJobs.length, updated_at: new Date().toISOString() })
        .eq("id", newClient.id);
    }

    return newClient;
  },
};

export interface ReferralProfile {
  id: string;
  full_name: string;
  phone?: string;
  referral_code: string;
  referral_count: number;
  reward_percent: number;
  created_at: string;
  updated_at: string;
}

export interface ReferralConversion {
  id: string;
  referral_profile_id: string;
  potential_client_id: string;
  referred_email: string;
  referrer_reward_percent: number;
  referred_reward_percent: number;
  created_at: string;
}

export const referralManager = {
  async createReferralProfile(
    profile: Omit<
      ReferralProfile,
      "id" | "created_at" | "updated_at" | "referral_count"
    >,
  ) {
    const { data, error } = await supabaseAdmin
      .from("referral_profiles")
      .insert({
        ...profile,
        referral_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as ReferralProfile;
  },

  async getReferralProfileByCode(referralCode: string) {
    const { data, error } = await supabaseAdmin
      .from("referral_profiles")
      .select("*")
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (error) throw error;
    return data as ReferralProfile | null;
  },

  async getReferralProfileByFullName(fullName: string) {
    const { data, error } = await supabaseAdmin
      .from("referral_profiles")
      .select("*")
      .ilike("full_name", fullName)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) throw error;
    return data as ReferralProfile | null;
  },

  async incrementReferralCount(referralProfileId: string) {
    const { error } = await supabaseAdmin.rpc("increment_referral_count", {
      referral_profile_id: referralProfileId,
    });

    if (error) throw error;
  },

  async getAllReferralProfiles() {
    const { data, error } = await supabaseAdmin
      .from("referral_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as ReferralProfile[];
  },

  async createReferralConversion(
    conversion: Omit<ReferralConversion, "id" | "created_at">,
  ) {
    const { data, error } = await supabaseAdmin
      .from("referral_conversions")
      .insert(conversion)
      .select()
      .single();

    if (error) throw error;
    return data as ReferralConversion;
  },
};

// Job Application interface
export interface JobApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position?: string | null;
  message?: string | null;
  cv_file_name: string;
  cv_file_type: string;
  cv_file_url?: string | null;
  created_at: string;
  updated_at: string;
}

// Job Application operations
// These use supabaseAdmin (service role) to bypass RLS for server-side operations
export const jobApplicationManager = {
  // Create a new job application
  async createJobApplication(
    application: Omit<JobApplication, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .insert(application)
      .select()
      .single();

    if (error) throw error;
    return data as JobApplication;
  },

  // Get all job applications
  async getAllJobApplications() {
    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as JobApplication[];
  },

  // Get a job application by ID
  async getJobApplicationById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as JobApplication;
  },
};
