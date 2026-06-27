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
      <div className="panel p-5">
        <p className="text-sm text-[var(--geist-foreground-secondary)]">
          Analyzing…
        </p>
      </div>
    );
  }

  const rows = [
    ["Customer", summary.customer],
    ["Location", summary.location],
    ["Service", summary.service],
    ["Urgency", summary.urgency],
    [
      "Est. value",
      moneyRange(summary.estimatedValue.min, summary.estimatedValue.max),
    ],
    ["Next step", summary.recommendedAction],
  ];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Summary</p>
        <LabelBadge label={summary.label} />
      </div>
      <dl className="mt-4 space-y-2.5">
        {rows.map(([key, val]) => (
          <div key={key} className="flex justify-between gap-4 text-sm">
            <dt className="text-[var(--geist-foreground-secondary)]">{key}</dt>
            <dd
              className={`text-right font-medium ${
                key === "Est. value" ? "font-mono tabular-nums" : ""
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
