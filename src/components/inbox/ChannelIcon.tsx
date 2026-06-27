import { CHANNEL_META } from "@/lib/labels";
import type { LeadChannel } from "@/lib/types";

export function ChannelIcon({ channel }: { channel: LeadChannel }) {
  const meta = CHANNEL_META[channel];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--geist-foreground-secondary)]">
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
