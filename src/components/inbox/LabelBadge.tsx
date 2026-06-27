import { LABEL_META } from "@/lib/labels";
import type { LeadLabel } from "@/lib/types";

export function LabelBadge({ label }: { label: LeadLabel }) {
  const meta = LABEL_META[label];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
