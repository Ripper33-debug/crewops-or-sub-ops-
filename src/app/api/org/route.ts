import { NextResponse } from "next/server";
import { getSessionOrg, isSubscriptionActive } from "@/lib/auth/session";
import { isDemoMode } from "@/lib/env";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({
      orgName: "Gulf Coast Pool Pros",
      subscriptionStatus: "trialing",
      formWebhookSecret: "demo",
      serviceArea: "Southwest Florida",
      active: true,
    });
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data: org } = await supabase
    .from("organizations")
    .select("name, service_area, subscription_status, form_webhook_secret, twilio_phone")
    .eq("id", session.orgId)
    .single();

  return NextResponse.json({
    orgId: session.orgId,
    orgName: org?.name,
    serviceArea: org?.service_area,
    subscriptionStatus: org?.subscription_status,
    formWebhookSecret: org?.form_webhook_secret,
    twilioPhone: org?.twilio_phone,
    active: isSubscriptionActive(org?.subscription_status ?? ""),
  });
}

export async function PATCH(req: Request) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updates: Record<string, string> = {};
  if (body.name) updates.name = body.name;
  if (body.serviceArea) updates.service_area = body.serviceArea;

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { error } = await supabase
    .from("organizations")
    .update(updates)
    .eq("id", session.orgId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
