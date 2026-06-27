import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import {
  followUpDraft,
  mapQuote,
  quoteAiAction,
  type DbQuote,
} from "@/lib/db/mappers";
import { isDemoMode } from "@/lib/env";
import { SEED_QUOTES } from "@/lib/mock-data";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({ quotes: SEED_QUOTES });
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("org_id", session.orgId)
    .order("sent_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const quotes = (data as DbQuote[]).map((q) => {
    const mapped = mapQuote(q);
    mapped.aiAction = quoteAiAction(q.sent_at);
    return mapped;
  });

  return NextResponse.json({ quotes });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (isDemoMode()) {
    return NextResponse.json({ error: "Use demo UI" }, { status: 400 });
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sentAt = new Date().toISOString();
  const draft = followUpDraft(body.customerName, body.job);

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data, error } = await supabase
    .from("quotes")
    .insert({
      org_id: session.orgId,
      lead_id: body.leadId || null,
      customer_name: body.customerName,
      job: body.job,
      amount: body.amount,
      status: "Sent just now",
      ai_action: "Wait 24 hrs",
      follow_up_draft: draft,
      sent_at: sentAt,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  if (body.leadId) {
    await supabase
      .from("leads")
      .update({ status: "quoted", updated_at: new Date().toISOString() })
      .eq("id", body.leadId);
  }

  return NextResponse.json({ quote: mapQuote(data as DbQuote) });
}
