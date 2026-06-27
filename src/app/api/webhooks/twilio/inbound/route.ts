import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzeAndPersistLead } from "@/lib/db/analyze";
import { isStopMessage, sendSms } from "@/lib/twilio";

function parseTwilioBody(text: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(text));
}

export async function POST(req: Request) {
  const text = await req.text();
  const params = parseTwilioBody(text);
  const from = params.From;
  const body = params.Body || "";

  if (!from) {
    return NextResponse.json({ error: "Missing From" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (isStopMessage(body)) {
    await admin
      .from("leads")
      .update({ do_not_contact: true })
      .eq("phone", from.replace(/\D/g, "").slice(-10));
    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  }

  const orgId = process.env.DEFAULT_ORG_ID;
  if (!orgId) {
    return NextResponse.json(
      { error: "DEFAULT_ORG_ID not configured for inbound SMS" },
      { status: 503 },
    );
  }

  const phone = from;
  const { data: lead, error } = await admin
    .from("leads")
    .insert({
      org_id: orgId,
      customer_name: phone,
      phone,
      channel: "sms",
      raw_message: body,
      sms_consent_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  await admin.from("messages").insert({
    org_id: orgId,
    lead_id: lead.id,
    direction: "inbound",
    body,
    twilio_sid: params.MessageSid,
  });

  try {
    await analyzeAndPersistLead(admin, lead.id, body, phone);
  } catch (err) {
    console.error("Inbound SMS analyze failed:", err);
  }

  try {
    await sendSms(phone, "Got your message — we'll get back to you shortly.");
  } catch {
    // auto-reply optional
  }

  return new NextResponse("<Response></Response>", {
    headers: { "Content-Type": "text/xml" },
  });
}
