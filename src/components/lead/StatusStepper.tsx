"use client";

import { STATUS_LABELS, STATUS_STEPS } from "@/lib/labels";
import type { LeadStatus } from "@/lib/types";

export function StatusStepper({ status }: { status: LeadStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(
    status as (typeof STATUS_STEPS)[number],
  );

  return (
    <ol className="flex flex-wrap gap-2">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <li
            key={step}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              active
                ? "bg-[var(--geist-accent)] text-white"
                : done
                  ? "bg-emerald-900/30 text-emerald-300"
                  : "bg-[var(--geist-border)] text-[var(--geist-foreground-secondary)]"
            }`}
          >
            {STATUS_LABELS[step]}
          </li>
        );
      })}
    </ol>
  );
}
