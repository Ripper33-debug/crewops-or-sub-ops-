import { CHANNEL_META } from "@/lib/labels";
import type { LeadChannel } from "@/lib/types";

export function ChannelIcon({ channel }: { channel: LeadChannel }) {
  const meta = CHANNEL_META[channel];
  return (
    <span className="text-xs text-[var(--geist-foreground-secondary)]">
      {meta.label}
    </span>
  );
}
