import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabase } from "@/lib/env";

export interface SessionOrg {
  orgId: string;
  userId: string;
  subscriptionStatus: string;
  formWebhookSecret: string;
  orgName: string;
}

export async function getSessionOrg(): Promise<SessionOrg | null> {
  if (!hasSupabase()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.org_id) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("name, subscription_status, form_webhook_secret")
    .eq("id", profile.org_id)
    .single();

  if (!org) return null;

  return {
    orgId: profile.org_id,
    userId: user.id,
    subscriptionStatus: org.subscription_status,
    formWebhookSecret: org.form_webhook_secret,
    orgName: org.name,
  };
}

export async function ensureUserOrg(
  userId: string,
  companyName?: string,
): Promise<string> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("profiles")
    .select("org_id")
    .eq("user_id", userId)
    .single();

  if (existing?.org_id) return existing.org_id;

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: companyName || "My Company",
      subscription_status: "trialing",
    })
    .select("id")
    .single();

  if (orgError || !org) {
    throw new Error(orgError?.message || "Failed to create organization");
  }

  const { error: profileError } = await admin.from("profiles").insert({
    user_id: userId,
    org_id: org.id,
    role: "owner",
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return org.id;
}

export function isSubscriptionActive(status: string): boolean {
  return status === "active" || status === "trialing";
}
