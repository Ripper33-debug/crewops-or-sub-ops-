"use client";

import Link from "next/link";
import { useLeadStore } from "@/context/LeadStore";
import { StatCard } from "@/components/layout/StatCard";
import { money } from "@/lib/format";

export function OwnerBrief() {
  const { briefStats, briefActions } = useLeadStore();

  const bullets = [
    `${briefStats.newLeadsNeedReply} leads need replies`,
    `${briefStats.quotesToFollowUp} quotes need follow-up`,
    `${briefStats.reviewRequestsReady} review request ready`,
    `${briefStats.maintenanceDue} customers due for maintenance`,
  ];

  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <p className="text-sm font-medium">Today</p>
        <ul className="mt-4 space-y-2">
          {bullets.map((item) => (
            <li
              key={item}
              className="text-sm text-[var(--geist-foreground-secondary)]"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-[var(--geist-border)] pt-4">
          <p className="text-xs text-[var(--geist-foreground-secondary)]">
            Open revenue
          </p>
          <p className="mt-1 font-mono text-3xl font-medium tabular-nums">
            {money(briefStats.estimatedOpenRevenue)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads to reply" value={briefStats.newLeadsNeedReply} />
        <StatCard label="Quotes to chase" value={briefStats.quotesToFollowUp} />
        <StatCard label="Review requests" value={briefStats.reviewRequestsReady} />
        <StatCard label="Maintenance due" value={briefStats.maintenanceDue} />
      </div>

      <div>
        <h2 className="text-sm font-medium">Actions</h2>
        <ul className="mt-3 divide-y divide-[var(--geist-border)] border border-[var(--geist-border)] rounded-md">
          {briefActions.map((action) => (
            <li key={action.id}>
              <Link
                href={action.href}
                className="block px-4 py-3 text-sm hover:bg-[var(--geist-background)]"
              >
                {action.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
