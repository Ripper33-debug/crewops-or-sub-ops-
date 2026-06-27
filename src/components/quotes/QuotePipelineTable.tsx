"use client";

import Link from "next/link";
import { useLeadStore } from "@/context/LeadStore";
import { money } from "@/lib/format";

export function QuotePipelineTable() {
  const { quotes, sendQuoteFollowUp } = useLeadStore();

  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--geist-border)]">
            <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
              Customer
            </th>
            <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
              Job
            </th>
            <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
              Quote
            </th>
            <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
              Status
            </th>
            <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr
              key={quote.id}
              className="border-b border-[var(--geist-border)] last:border-0 hover:bg-[var(--geist-background)]"
            >
              <td className="px-4 py-3">
                {quote.leadId ? (
                  <Link href={`/dashboard/leads/${quote.leadId}`} className="hover:underline">
                    {quote.customerName}
                  </Link>
                ) : (
                  quote.customerName
                )}
              </td>
              <td className="px-4 py-3 text-[var(--geist-foreground-secondary)]">
                {quote.job}
              </td>
              <td className="px-4 py-3 font-mono tabular-nums">
                {money(quote.amount)}
              </td>
              <td className="px-4 py-3 text-[var(--geist-foreground-secondary)]">
                {quote.status}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs">{quote.aiAction}</span>
                  {quote.followUpDraft && (
                    <button
                      type="button"
                      onClick={() => sendQuoteFollowUp(quote.id)}
                      className="text-left text-xs text-[var(--geist-accent)] hover:underline"
                    >
                      Send follow-up
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
