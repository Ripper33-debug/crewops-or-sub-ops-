"use client";

import Link from "next/link";
import { useLeadStore } from "@/context/LeadStore";
import { StatCard } from "@/components/layout/StatCard";
import { money } from "@/lib/format";

export function OwnerBrief() {
  const { briefStats, briefActions } = useLeadStore();

  const bullets = [
    `${briefStats.newLeadsNeedReply} new lead${briefStats.newLeadsNeedReply === 1 ? "" : "s"} need replies`,
    `${briefStats.quotesToFollowUp} quote${briefStats.quotesToFollowUp === 1 ? "" : "s"} should be followed up`,
    `${briefStats.reviewRequestsReady} customer${briefStats.reviewRequestsReady === 1 ? " is" : "s are"} ready for review request`,
    `${briefStats.maintenanceDue} past customer${briefStats.maintenanceDue === 1 ? "" : "s"} due for maintenance`,
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[var(--geist-border)] bg-gradient-to-br from-blue-950/30 to-[var(--geist-background-secondary)] p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--geist-accent)]">
          Today&apos;s Revenue Opportunities
        </p>
        <ul className="mt-4 space-y-2">
          {bullets.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-[var(--geist-foreground)]"
            >
              <span className="text-[var(--geist-accent)]">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--geist-foreground-secondary)]">
          Estimated open revenue
        </p>
        <p className="text-4xl font-bold tabular-nums tracking-tight text-[var(--geist-foreground)]">
          {money(briefStats.estimatedOpenRevenue)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Leads to reply"
          value={briefStats.newLeadsNeedReply}
          accent="text-[var(--geist-accent)]"
        />
        <StatCard
          label="Quotes to chase"
          value={briefStats.quotesToFollowUp}
          accent="text-amber-400"
        />
        <StatCard
          label="Review requests"
          value={briefStats.reviewRequestsReady}
        />
        <StatCard
          label="Maintenance due"
          value={briefStats.maintenanceDue}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold">Priority actions</h2>
        <ul className="mt-4 space-y-2">
          {briefActions.map((action) => (
            <li key={action.id}>
              <Link
                href={action.href}
                className={`flex items-center justify-between rounded-lg border border-[var(--geist-border)] px-4 py-3 text-sm transition-colors hover:bg-[var(--geist-background-secondary)] ${
                  action.priority === "high"
                    ? "border-l-2 border-l-red-500"
                    : action.priority === "medium"
                      ? "border-l-2 border-l-amber-500"
                      : ""
                }`}
              >
                <span>{action.text}</span>
                <span className="text-[var(--geist-accent)]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
