import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapQuote, type DbQuote } from "@/lib/db/mappers";
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
  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .eq("org_id", session.orgId)
    .single();

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = quote as DbQuote;
  const message = body.message || row.follow_up_draft || "Following up on your quote.";

  let phone: string | null = null;
  if (row.lead_id) {
    const { data: lead } = await supabase
      .from("leads")
      .select("phone, sms_consent_at, do_not_contact")
      .eq("id", row.lead_id)
      .single();
    if (lead?.do_not_contact) {
      return NextResponse.json({ error: "Lead opted out" }, { status: 400 });
    }
    if (lead?.phone && lead.sms_consent_at) phone = lead.phone;
  }

  let twilioSid: string | null = null;
  if (phone) {
    try {
      twilioSid = await sendSms(phone, message);
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
    lead_id: row.lead_id,
    quote_id: id,
    direction: "outbound",
    body: message,
    twilio_sid: twilioSid,
  });

  const now = new Date().toISOString();
  const { data: updated } = await supabase
    .from("quotes")
    .update({ last_follow_up_at: now, ai_action: "Followed up" })
    .eq("id", id)
    .select("*")
    .single();

  return NextResponse.json({
    ok: true,
    smsSent: Boolean(twilioSid),
    quote: updated ? mapQuote(updated as DbQuote) : null,
  });
}
