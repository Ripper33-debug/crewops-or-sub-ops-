import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzeAndPersistLead } from "@/lib/db/analyze";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  message: z.string().min(1),
  location: z.string().optional(),
  sms_consent: z.boolean().optional(),
});

type Params = { params: Promise<{ token: string }> };

export async function POST(req: Request, { params }: Params) {
  const { token } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = FormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: org } = await admin
    .from("organizations")
    .select("id, service_area")
    .eq("form_webhook_secret", token)
    .single();

  if (!org) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const { data: lead, error } = await admin
    .from("leads")
    .insert({
      org_id: org.id,
      customer_name: parsed.data.name,
      phone: parsed.data.phone || null,
      location: parsed.data.location || org.service_area || "Southwest Florida",
      channel: "website_form",
      raw_message: parsed.data.message,
      sms_consent_at: parsed.data.sms_consent
        ? new Date().toISOString()
        : parsed.data.phone
          ? new Date().toISOString()
          : null,
    })
    .select("id")
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  try {
    await analyzeAndPersistLead(
      admin,
      lead.id,
      parsed.data.message,
      parsed.data.name,
    );
  } catch (err) {
    console.error("Webhook analyze failed:", err);
  }

  return NextResponse.json({ ok: true, leadId: lead.id });
}
