export type LeadLabel =
  | "hot_lead"
  | "needs_quote"
  | "price_shopper"
  | "emergency"
  | "follow_up"
  | "bad_fit";

export type LeadChannel =
  | "missed_call"
  | "website_form"
  | "facebook"
  | "sms"
  | "past_customer"
  | "quote_request";

export type LeadStatus =
  | "new"
  | "summarized"
  | "replied"
  | "ready_to_book"
  | "quoted"
  | "closed";

export interface LeadAnalysis {
  customer: string;
  location: string;
  service: string;
  urgency: string;
  estimatedValue: { min: number; max: number };
  label: LeadLabel;
  recommendedAction: string;
  draftReply: string;
}

export interface Lead {
  id: string;
  customerName: string;
  phone?: string;
  location: string;
  channel: LeadChannel;
  label: LeadLabel;
  status: LeadStatus;
  rawMessage: string;
  summary?: LeadAnalysis;
  smsConsentAt?: string;
  doNotContact?: boolean;
  createdAt: string;
}

export interface Quote {
  id: string;
  leadId?: string;
  customerName: string;
  job: string;
  amount: number;
  status: string;
  aiAction: string;
  followUpDraft?: string;
  sentAt: string;
  lastFollowUpAt?: string;
}

export interface BriefStats {
  newLeadsNeedReply: number;
  quotesToFollowUp: number;
  reviewRequestsReady: number;
  maintenanceDue: number;
  estimatedOpenRevenue: number;
}

export interface BriefAction {
  id: string;
  text: string;
  href: string;
  priority: "high" | "medium" | "low";
}

export interface CreateLeadInput {
  rawMessage: string;
  channel?: LeadChannel;
  customerName?: string;
  phone?: string;
  smsConsent?: boolean;
}

export interface CreateQuoteInput {
  leadId: string;
  customerName: string;
  job: string;
  amount: number;
}
