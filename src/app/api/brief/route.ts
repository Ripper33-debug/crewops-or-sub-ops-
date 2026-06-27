import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import { quoteAiAction } from "@/lib/db/mappers";
import { isDemoMode } from "@/lib/env";
import {
  BASE_OPEN_REVENUE,
  MAINTENANCE_DUE_COUNT,
  REVIEW_REQUESTS_READY,
  SEED_LEADS,
  SEED_QUOTES,
} from "@/lib/mock-data";
import type { BriefAction, BriefStats, Lead } from "@/lib/types";

function buildBrief(leads: Lead[], quotes: { amount: number; status: string; aiAction: string; customerName: string; job: string; id: string; leadId?: string; sentAt: string }[]): { stats: BriefStats; actions: BriefAction[] } {
  const newLeadsNeedReply = leads.filter(
    (l) => l.status === "new" || l.status === "summarized",
  ).length;
  const quotesToFollowUp = quotes.filter((q) =>
    quoteAiAction(q.sentAt).toLowerCase().includes("follow up"),
  ).length;
  const openRevenue = quotes.reduce((s, q) => s + q.amount, 0);

  const actions: BriefAction[] = [];
  leads
    .filter((l) => l.status === "new" || l.status === "summarized")
    .slice(0, 3)
    .forEach((l) => {
      actions.push({
        id: `lead-${l.id}`,
        text: `Reply to ${l.customerName}`,
        href: `/dashboard/leads/${l.id}`,
        priority: l.label === "emergency" ? "high" : "medium",
      });
    });
  quotes
    .filter((q) => quoteAiAction(q.sentAt).toLowerCase().includes("follow up"))
    .slice(0, 2)
    .forEach((q) => {
      actions.push({
        id: `quote-${q.id}`,
        text: `Follow up: ${q.customerName} — ${q.job}`,
        href: q.leadId ? `/dashboard/leads/${q.leadId}` : "/dashboard/quotes",
        priority: "high",
      });
    });

  return {
    stats: {
      newLeadsNeedReply,
      quotesToFollowUp,
      reviewRequestsReady: REVIEW_REQUESTS_READY,
      maintenanceDue: MAINTENANCE_DUE_COUNT,
      estimatedOpenRevenue: openRevenue || BASE_OPEN_REVENUE,
    },
    actions,
  };
}

export async function GET() {
  if (isDemoMode()) {
    const brief = buildBrief(SEED_LEADS, SEED_QUOTES);
    return NextResponse.json(brief);
  }

  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const [{ data: leads }, { data: quotes }] = await Promise.all([
    supabase.from("leads").select("*").eq("org_id", session.orgId),
    supabase.from("quotes").select("*").eq("org_id", session.orgId),
  ]);

  const { mapLead, mapQuote } = await import("@/lib/db/mappers");
  const mappedLeads = (leads || []).map((l) => mapLead(l));
  const mappedQuotes = (quotes || []).map((q) => mapQuote(q));

  return NextResponse.json(buildBrief(mappedLeads, mappedQuotes));
}
