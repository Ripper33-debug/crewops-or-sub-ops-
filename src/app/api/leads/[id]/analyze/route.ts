import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import { analyzeAndPersistLead } from "@/lib/db/analyze";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapLead, type DbLead } from "@/lib/db/mappers";
import { analyzeLeadOnServer } from "@/lib/ai/analyze-lead-server";
import { isDemoMode } from "@/lib/env";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;

  if (isDemoMode()) {
    const body = await req.json().catch(() => ({}));
    const result = await analyzeLeadOnServer(
      body.rawMessage || "",
      body.customerName,
    );
    return NextResponse.json(result);
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

  const admin = createAdminClient();
  const body = await req.json().catch(() => ({}));
  const rawMessage = body.rawMessage || lead.raw_message;
  const customerName = body.customerName || lead.customer_name;

  try {
    const result = await analyzeLeadOnServer(rawMessage, customerName);
    await admin
      .from("leads")
      .update({
        summary: result.analysis,
        label: result.analysis.label,
        customer_name: result.analysis.customer,
        location: result.analysis.location,
        status: lead.status === "new" ? "summarized" : lead.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    const { data: updated } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    return NextResponse.json({
      ...result,
      lead: updated ? mapLead(updated as DbLead) : null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
