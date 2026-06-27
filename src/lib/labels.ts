import type { LeadLabel, LeadChannel } from "./types";

export const LABEL_META: Record<
  LeadLabel,
  { label: string; className: string; sortOrder: number }
> = {
  emergency: {
    label: "Emergency",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    sortOrder: 0,
  },
  hot_lead: {
    label: "Hot lead",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    sortOrder: 1,
  },
  needs_quote: {
    label: "Needs quote",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    sortOrder: 2,
  },
  follow_up: {
    label: "Follow-up needed",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    sortOrder: 3,
  },
  price_shopper: {
    label: "Price shopper",
    className:
      "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    sortOrder: 4,
  },
  bad_fit: {
    label: "Bad fit",
    className:
      "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500",
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
