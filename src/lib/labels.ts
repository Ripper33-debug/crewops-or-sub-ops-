import type { LeadLabel, LeadChannel } from "./types";

export const LABEL_META: Record<
  LeadLabel,
  { label: string; className: string; sortOrder: number }
> = {
  emergency: {
    label: "Emergency",
    className:
      "bg-red-500/15 text-red-400 ring-1 ring-red-500/25",
    sortOrder: 0,
  },
  hot_lead: {
    label: "Hot lead",
    className:
      "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/25",
    sortOrder: 1,
  },
  needs_quote: {
    label: "Needs quote",
    className:
      "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/25",
    sortOrder: 2,
  },
  follow_up: {
    label: "Follow-up",
    className:
      "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25",
    sortOrder: 3,
  },
  price_shopper: {
    label: "Price shopper",
    className:
      "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/25",
    sortOrder: 4,
  },
  bad_fit: {
    label: "Bad fit",
    className:
      "bg-zinc-600/10 text-zinc-500 ring-1 ring-zinc-600/20",
    sortOrder: 5,
  },
};

export const CHANNEL_META: Record<
  LeadChannel,
  { label: string; icon: string }
> = {
  missed_call: { label: "Missed call", icon: "📞" },
  website_form: { label: "Website form", icon: "🌐" },
  facebook: { label: "Facebook lead", icon: "📘" },
  sms: { label: "Text message", icon: "💬" },
  past_customer: { label: "Past customer", icon: "🔄" },
  quote_request: { label: "Quote request", icon: "📋" },
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
  ready_to_book: "Ready to Book",
  quoted: "Quoted",
  closed: "Closed",
};
