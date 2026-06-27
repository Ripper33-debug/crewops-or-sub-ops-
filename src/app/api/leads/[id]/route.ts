import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import { mapLead, type DbLead } from "@/lib/db/mappers";
import { isDemoMode } from "@/lib/env";
import { SEED_LEADS } from "@/lib/mock-data";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  if (isDemoMode()) {
    const lead = SEED_LEADS.find((l) => l.id === id);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead });
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("org_id", session.orgId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ lead: mapLead(data as DbLead) });
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  if (isDemoMode()) {
    return NextResponse.json({ ok: true });
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (body.status) updates.status = body.status;
  if (body.label) updates.label = body.label;

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .eq("org_id", session.orgId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead: mapLead(data as DbLead) });
}
