"use client";

import { STATUS_LABELS, STATUS_STEPS } from "@/lib/labels";
import { IconCheck } from "@/components/ui/Icons";
import type { LeadStatus } from "@/lib/types";

export function StatusStepper({ status }: { status: LeadStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(
    status as (typeof STATUS_STEPS)[number],
  );

  return (
    <div className="glass-panel rounded-xl p-4">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[var(--geist-foreground-secondary)]">
        Pipeline status
      </p>
      <ol className="flex flex-wrap gap-2">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;
          return (
            <li
              key={step}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                active
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : done
                    ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25"
                    : "bg-white/[0.03] text-[var(--geist-foreground-secondary)] ring-1 ring-[var(--geist-border)]"
              }`}
            >
              {done && !active && <IconCheck className="h-3 w-3" />}
              {STATUS_LABELS[step]}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
