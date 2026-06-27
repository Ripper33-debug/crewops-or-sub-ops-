import { moneyRange } from "@/lib/format";
import { LabelBadge } from "@/components/inbox/LabelBadge";
import { IconSparkle } from "@/components/ui/Icons";
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
      <div className="glass-panel ai-shimmer rounded-xl p-6">
        <div className="flex items-center gap-2 text-sm text-sky-400">
          <IconSparkle className="h-4 w-4 ai-pulse" />
          Analyzing lead…
        </div>
      </div>
    );
  }

  const rows = [
    ["Customer", summary.customer],
    ["Location", summary.location],
    ["Service", summary.service],
    ["Urgency", summary.urgency],
    [
      "Estimated value",
      moneyRange(summary.estimatedValue.min, summary.estimatedValue.max),
    ],
    ["Recommended action", summary.recommendedAction],
  ];

  return (
    <div className="glass-panel relative overflow-hidden rounded-xl p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
            <IconSparkle className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-[var(--geist-foreground)]">
            AI Lead Summary
          </p>
        </div>
        <LabelBadge label={summary.label} />
      </div>

      <dl className="relative mt-5 space-y-3">
        {rows.map(([key, val]) => (
          <div
            key={key}
            className="flex items-start justify-between gap-4 border-b border-[var(--geist-border)] pb-3 last:border-0 last:pb-0"
          >
            <dt className="text-xs font-medium text-[var(--geist-foreground-secondary)]">
              {key}
            </dt>
            <dd
              className={`text-right text-sm font-medium text-[var(--geist-foreground)] ${
                key === "Estimated value" ? "font-mono tabular-nums text-emerald-400" : ""
              }`}
            >
              {val}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
