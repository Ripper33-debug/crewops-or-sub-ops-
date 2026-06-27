import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import { mapLead, type DbLead } from "@/lib/db/mappers";
import { isDemoMode } from "@/lib/env";
import { SEED_LEADS } from "@/lib/mock-data";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({ leads: SEED_LEADS });
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
    .eq("org_id", session.orgId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    leads: (data as DbLead[]).map(mapLead),
  });
}

export async function POST(req: Request) {
  if (isDemoMode()) {
    return NextResponse.json({ error: "Use demo UI" }, { status: 400 });
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.rawMessage) {
    return NextResponse.json({ error: "rawMessage required" }, { status: 400 });
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data, error } = await supabase
    .from("leads")
    .insert({
      org_id: session.orgId,
      customer_name: body.customerName || "New lead",
      phone: body.phone || null,
      raw_message: body.rawMessage,
      channel: body.channel || "website_form",
      sms_consent_at: body.smsConsent ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  return NextResponse.json({ lead: mapLead(data as DbLead) });
}
