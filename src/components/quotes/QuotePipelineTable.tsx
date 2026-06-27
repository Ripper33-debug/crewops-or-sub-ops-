"use client";

import Link from "next/link";
import { useLeadStore } from "@/context/LeadStore";
import { money } from "@/lib/format";

export function QuotePipelineTable() {
  const { quotes } = useLeadStore();

  async function copyFollowUp(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--geist-border)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--geist-border)] bg-[var(--geist-background-secondary)]">
            <th className="px-4 py-3 font-medium text-[var(--geist-foreground-secondary)]">
              Customer
            </th>
            <th className="px-4 py-3 font-medium text-[var(--geist-foreground-secondary)]">
              Job
            </th>
            <th className="px-4 py-3 font-medium text-[var(--geist-foreground-secondary)]">
              Quote
            </th>
            <th className="px-4 py-3 font-medium text-[var(--geist-foreground-secondary)]">
              Status
            </th>
            <th className="px-4 py-3 font-medium text-[var(--geist-foreground-secondary)]">
              AI Action
            </th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr
              key={quote.id}
              className="border-b border-[var(--geist-border)] last:border-0 hover:bg-[var(--geist-background-secondary)]"
            >
              <td className="px-4 py-3">
                {quote.leadId ? (
                  <Link
                    href={`/dashboard/leads/${quote.leadId}`}
                    className="font-medium hover:text-[var(--geist-accent)]"
                  >
                    {quote.customerName}
                  </Link>
                ) : (
                  <span className="font-medium">{quote.customerName}</span>
                )}
              </td>
              <td className="px-4 py-3 text-[var(--geist-foreground-secondary)]">
                {quote.job}
              </td>
              <td className="px-4 py-3 tabular-nums font-medium">
                {money(quote.amount)}
              </td>
              <td className="px-4 py-3 text-[var(--geist-foreground-secondary)]">
                {quote.status}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                    {quote.aiAction}
                  </span>
                  {quote.followUpDraft && (
                    <button
                      type="button"
                      onClick={() => copyFollowUp(quote.followUpDraft!)}
                      className="text-xs text-[var(--geist-accent)] hover:underline"
                    >
                      Copy follow-up
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
