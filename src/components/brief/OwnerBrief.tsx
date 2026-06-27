"use client";

import Link from "next/link";
import { useLeadStore } from "@/context/LeadStore";
import { StatCard } from "@/components/layout/StatCard";
import { IconSparkle, IconArrowRight } from "@/components/ui/Icons";
import { money } from "@/lib/format";

export function OwnerBrief() {
  const { briefStats, briefActions } = useLeadStore();

  const bullets = [
    {
      text: `${briefStats.newLeadsNeedReply} new lead${briefStats.newLeadsNeedReply === 1 ? "" : "s"} need replies`,
      urgent: briefStats.newLeadsNeedReply > 0,
    },
    {
      text: `${briefStats.quotesToFollowUp} quote${briefStats.quotesToFollowUp === 1 ? "" : "s"} should be followed up`,
      urgent: briefStats.quotesToFollowUp > 0,
    },
    {
      text: `${briefStats.reviewRequestsReady} customer ready for review request`,
      urgent: false,
    },
    {
      text: `${briefStats.maintenanceDue} past customers due for maintenance`,
      urgent: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-[var(--geist-background-secondary)] to-emerald-950/20 p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <IconSparkle className="h-5 w-5 text-sky-400" />
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">
            Today&apos;s Revenue Opportunities
          </p>
        </div>
        <ul className="relative mt-6 space-y-3">
          {bullets.map((item) => (
            <li
              key={item.text}
              className="flex items-center gap-3 text-sm text-[var(--geist-foreground)]"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  item.urgent ? "bg-red-400" : "bg-sky-400"
                }`}
              />
              {item.text}
            </li>
          ))}
        </ul>
        <div className="relative mt-8 border-t border-[var(--geist-border)] pt-6">
          <p className="text-sm text-[var(--geist-foreground-secondary)]">
            Estimated open revenue
          </p>
          <p className="mt-1 font-mono text-5xl font-bold tabular-nums tracking-tight text-emerald-400">
            {money(briefStats.estimatedOpenRevenue)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Leads to reply"
          value={briefStats.newLeadsNeedReply}
          accent="text-sky-400"
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
                className={`group flex items-center justify-between rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)]/40 px-4 py-3.5 text-sm transition-all hover:border-sky-500/30 hover:bg-[var(--geist-background-secondary)] ${
                  action.priority === "high"
                    ? "border-l-2 border-l-red-500"
                    : action.priority === "medium"
                      ? "border-l-2 border-l-amber-500"
                      : ""
                }`}
              >
                <span>{action.text}</span>
                <IconArrowRight className="h-4 w-4 text-[var(--geist-foreground-secondary)] transition-transform group-hover:translate-x-0.5 group-hover:text-sky-400" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
