"use client";

import { STATUS_LABELS, STATUS_STEPS } from "@/lib/labels";
import { IconCheck } from "@/components/ui/Icons";
import type { LeadStatus } from "@/lib/types";

export function StatusStepper({ status }: { status: LeadStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(
    status as (typeof STATUS_STEPS)[number],
  );

  return (
    <div className="panel p-4">
      <p className="mb-3 text-xs text-[var(--geist-foreground-secondary)]">
        Status
      </p>
      <ol className="flex flex-wrap gap-1.5">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;
          return (
            <li
              key={step}
              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${
                active
                  ? "bg-[var(--geist-foreground)] text-[var(--geist-background)]"
                  : done
                    ? "border border-[var(--geist-border)] text-[var(--geist-foreground-secondary)]"
                    : "text-[var(--geist-foreground-secondary)]"
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
