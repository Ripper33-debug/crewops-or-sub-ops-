import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import { mapLead, type DbLead } from "@/lib/db/mappers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSms } from "@/lib/twilio";
import { isDemoMode } from "@/lib/env";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (isDemoMode()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("org_id", session.orgId)
    .single();

  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = lead as DbLead;
  if (row.do_not_contact) {
    return NextResponse.json({ error: "Lead opted out" }, { status: 400 });
  }

  const summary = row.summary as { draftReply?: string } | null;
  const message =
    body.message || summary?.draftReply || "Thanks for reaching out — we'll be in touch soon.";

  let twilioSid: string | null = null;
  if (row.phone) {
    if (!row.sms_consent_at) {
      return NextResponse.json(
        { error: "No SMS consent on file for this lead" },
        { status: 400 },
      );
    }
    try {
      twilioSid = await sendSms(row.phone, message);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "SMS failed" },
        { status: 502 },
      );
    }
  }

  const admin = createAdminClient();
  await admin.from("messages").insert({
    org_id: session.orgId,
    lead_id: id,
    direction: "outbound",
    body: message,
    twilio_sid: twilioSid,
  });

  const { data: updated } = await supabase
    .from("leads")
    .update({ status: "replied", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  return NextResponse.json({
    ok: true,
    smsSent: Boolean(twilioSid),
    lead: updated ? mapLead(updated as DbLead) : null,
  });
}
