import { CHANNEL_META } from "@/lib/labels";
import type { LeadChannel } from "@/lib/types";

const CHANNEL_ICONS: Record<LeadChannel, string> = {
  missed_call: "📞",
  website_form: "🌐",
  facebook: "📘",
  sms: "💬",
  past_customer: "🔄",
  quote_request: "📋",
};

export function ChannelIcon({ channel }: { channel: LeadChannel }) {
  const meta = CHANNEL_META[channel];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[var(--geist-foreground-secondary)] ring-1 ring-[var(--geist-border)]">
      <span aria-hidden>{CHANNEL_ICONS[channel]}</span>
      {meta.label}
    </span>
  );
}
