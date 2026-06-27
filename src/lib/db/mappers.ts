import type {
  Lead,
  LeadAnalysis,
  LeadChannel,
  LeadLabel,
  LeadStatus,
  Quote,
} from "@/lib/types";

export interface DbLead {
  id: string;
  org_id: string;
  customer_name: string;
  phone: string | null;
  location: string;
  channel: string;
  label: string;
  status: string;
  raw_message: string;
  summary: LeadAnalysis | null;
  sms_consent_at: string | null;
  do_not_contact: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbQuote {
  id: string;
  org_id: string;
  lead_id: string | null;
  customer_name: string;
  job: string;
  amount: number;
  status: string;
  ai_action: string;
  follow_up_draft: string | null;
  sent_at: string;
  last_follow_up_at: string | null;
}

export function mapLead(row: DbLead): Lead {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone ?? undefined,
    location: row.location,
    channel: row.channel as LeadChannel,
    label: row.label as LeadLabel,
    status: row.status as LeadStatus,
    rawMessage: row.raw_message,
    summary: row.summary ?? undefined,
    smsConsentAt: row.sms_consent_at ?? undefined,
    doNotContact: row.do_not_contact,
    createdAt: row.created_at,
  };
}

export function mapQuote(row: DbQuote): Quote {
  return {
    id: row.id,
    leadId: row.lead_id ?? undefined,
    customerName: row.customer_name,
    job: row.job,
    amount: Number(row.amount),
    status: row.status,
    aiAction: row.ai_action,
    followUpDraft: row.follow_up_draft ?? undefined,
    sentAt: row.sent_at,
    lastFollowUpAt: row.last_follow_up_at ?? undefined,
  };
}

export function quoteAiAction(sentAt: string): string {
  const hours =
    (Date.now() - new Date(sentAt).getTime()) / (1000 * 60 * 60);
  if (hours < 24) return "Wait 24 hrs";
  return "Follow up today";
}

export function followUpDraft(customerName: string, job: string): string {
  const first = customerName.split(" ")[0];
  return `Hi ${first}, following up on the ${job.toLowerCase()} quote. Let us know if you have questions or want to schedule.`;
}
