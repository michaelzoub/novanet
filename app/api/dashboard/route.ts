import { NextResponse } from "next/server";
import { referralManager, jobManager, potentialClientManager, clientManager } from "@/lib/supabase";

function auth(request: Request) {
  const code = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
  const valid = process.env.DASHBOARD_CODE;
  return valid && code === valid;
}

export async function GET(request: Request) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") ?? "referrals";
  const status = searchParams.get("status");

  try {
    if (action === "jobs") {
      const jobs = status
        ? await jobManager.getJobsByStatus(status)
        : await jobManager.getAllJobs();
      return NextResponse.json({ success: true, data: jobs });
    }

    if (action === "potential_clients") {
      const prospects = status
        ? await potentialClientManager.getAllPotentialClients().then((list) =>
            list.filter((p) => p.status === status),
          )
        : await potentialClientManager.getAllPotentialClients();
      return NextResponse.json({ success: true, data: prospects });
    }

    if (action === "clients") {
      const clients = await clientManager.getAllClients();
      return NextResponse.json({ success: true, data: clients });
    }

    // default: referrals
    const profiles = await referralManager.getAllReferralProfiles();
    return NextResponse.json({ success: true, data: profiles });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ error: "Fetch failed." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required." }, { status: 400 });
    }

    if (type === "job") {
      const updated = await jobManager.updateJob(id, { status });
      // Sync to linked prospect so both stay in lock-step
      if (updated.potential_client_id) {
        await potentialClientManager.updateStatus(updated.potential_client_id, status).catch(() => {});
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === "prospect") {
      const updated = await potentialClientManager.updateStatus(id, status);
      // Sync to linked job so both stay in lock-step
      const linkedJob = await jobManager.getJobByPotentialClientId(id).catch(() => null);
      if (linkedJob) {
        await jobManager.updateJob(linkedJob.id, { status }).catch(() => {});
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ error: "Unknown type." }, { status: 400 });
  } catch (error) {
    console.error("Dashboard PATCH error:", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, potentialClientId, name, address } = body;

    if (action === "convert_client") {
      if (!potentialClientId || !name || !address) {
        return NextResponse.json(
          { error: "potentialClientId, name, and address are required." },
          { status: 400 },
        );
      }

      const client = await potentialClientManager.convertToClient(potentialClientId, name, address);
      // Mark the prospect as completed so it doesn't reappear on refresh
      await potentialClientManager.updateStatus(potentialClientId, "completed").catch(() => {});
      return NextResponse.json({ success: true, data: client });
    }

    if (action === "add_job") {
      const { clientId, jobType, description, jobStatus } = body;
      if (!clientId || !jobType) {
        return NextResponse.json({ error: "clientId and jobType are required." }, { status: 400 });
      }

      const job = await jobManager.createJob({
        client_id: clientId,
        potential_client_id: null,
        job_type: jobType,
        status: jobStatus || "quoting",
        location: [0, 0],
        description: description || null,
      });
      return NextResponse.json({ success: true, data: job });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("Dashboard POST error:", error);
    return NextResponse.json({ error: "Action failed." }, { status: 500 });
  }
}
