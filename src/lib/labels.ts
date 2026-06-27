import type { LeadLabel, LeadChannel } from "./types";

export const LABEL_META: Record<
  LeadLabel,
  { label: string; className: string; sortOrder: number }
> = {
  emergency: {
    label: "Emergency",
    className: "bg-[#3f1515] text-[#fca5a5]",
    sortOrder: 0,
  },
  hot_lead: {
    label: "Hot lead",
    className: "bg-[#2a2010] text-[#fcd34d]",
    sortOrder: 1,
  },
  needs_quote: {
    label: "Needs quote",
    className: "bg-[#111827] text-[#93c5fd]",
    sortOrder: 2,
  },
  follow_up: {
    label: "Follow-up",
    className: "bg-[#1f1a10] text-[#d4a574]",
    sortOrder: 3,
  },
  price_shopper: {
    label: "Price shopper",
    className: "bg-[#1a1a1a] text-[#a3a3a3]",
    sortOrder: 4,
  },
  bad_fit: {
    label: "Bad fit",
    className: "bg-[#141414] text-[#737373]",
    sortOrder: 5,
  },
};

export const CHANNEL_META: Record<LeadChannel, { label: string }> = {
  missed_call: { label: "Missed call" },
  website_form: { label: "Website form" },
  facebook: { label: "Facebook" },
  sms: { label: "Text" },
  past_customer: { label: "Past customer" },
  quote_request: { label: "Quote request" },
};

export const STATUS_STEPS = [
  "new",
  "summarized",
  "replied",
  "ready_to_book",
  "quoted",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  summarized: "Summarized",
  replied: "Replied",
  ready_to_book: "Ready to book",
  quoted: "Quoted",
  closed: "Closed",
};
