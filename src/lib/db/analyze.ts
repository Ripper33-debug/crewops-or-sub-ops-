import type { LeadAnalysis } from "@/lib/types";
import { analyzeLeadOnServer } from "@/lib/ai/analyze-lead-server";

export { analyzeLeadOnServer };

export async function analyzeAndPersistLead(
  admin: ReturnType<typeof import("@/lib/supabase/admin").createAdminClient>,
  leadId: string,
  rawMessage: string,
  customerName?: string,
): Promise<LeadAnalysis> {
  const result = await analyzeLeadOnServer(rawMessage, customerName);
  const summary = result.analysis;

  await admin
    .from("leads")
    .update({
      summary,
      label: summary.label,
      customer_name: summary.customer,
      location: summary.location,
      status: "summarized",
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  return summary;
}
