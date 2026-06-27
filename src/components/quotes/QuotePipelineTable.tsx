"use client";

import Link from "next/link";
import { useLeadStore } from "@/context/LeadStore";
import { Avatar } from "@/components/ui/Avatar";
import { money } from "@/lib/format";

export function QuotePipelineTable() {
  const { quotes } = useLeadStore();

  async function copyFollowUp(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote, i) => (
        <div
          key={quote.id}
          className="glass-panel animate-fade-up flex flex-wrap items-center gap-4 rounded-xl p-4 transition-all hover:border-sky-500/20"
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          <Avatar name={quote.customerName} size="sm" />
          <div className="min-w-0 flex-1">
            {quote.leadId ? (
              <Link
                href={`/dashboard/leads/${quote.leadId}`}
                className="font-medium hover:text-sky-400"
              >
                {quote.customerName}
              </Link>
            ) : (
              <p className="font-medium">{quote.customerName}</p>
            )}
            <p className="text-sm text-[var(--geist-foreground-secondary)]">
              {quote.job}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-semibold tabular-nums text-emerald-400">
              {money(quote.amount)}
            </p>
            <p className="text-xs text-[var(--geist-foreground-secondary)]">
              {quote.status}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-col sm:items-end">
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/25">
              {quote.aiAction}
            </span>
            {quote.followUpDraft && (
              <button
                type="button"
                onClick={() => copyFollowUp(quote.followUpDraft!)}
                className="text-xs text-sky-400 hover:underline"
              >
                Copy follow-up
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
