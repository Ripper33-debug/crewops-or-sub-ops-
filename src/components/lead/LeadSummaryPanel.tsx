import { moneyRange } from "@/lib/format";
import { LabelBadge } from "@/components/inbox/LabelBadge";
import type { LeadAnalysis } from "@/lib/types";

interface LeadSummaryPanelProps {
  summary: LeadAnalysis;
  isAnalyzing?: boolean;
}

export function LeadSummaryPanel({
  summary,
  isAnalyzing,
}: LeadSummaryPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] p-6">
        <p className="text-sm text-[var(--geist-foreground-secondary)]">
          Analyzing lead…
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--geist-border)] bg-gradient-to-br from-blue-950/20 to-[var(--geist-background-secondary)] p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--geist-accent)]">
          AI Lead Summary
        </p>
        <LabelBadge label={summary.label} />
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        {[
          ["Customer", summary.customer],
          ["Location", summary.location],
          ["Service", summary.service],
          ["Urgency", summary.urgency],
          [
            "Estimated value",
            moneyRange(summary.estimatedValue.min, summary.estimatedValue.max),
          ],
          ["Recommended action", summary.recommendedAction],
        ].map(([key, val]) => (
          <div key={key}>
            <dt className="text-xs font-medium text-[var(--geist-foreground-secondary)]">
              {key}
            </dt>
            <dd className="mt-0.5 font-medium text-[var(--geist-foreground)]">
              {val}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
