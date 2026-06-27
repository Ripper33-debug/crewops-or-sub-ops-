"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChannelIcon } from "./ChannelIcon";
import { LabelBadge } from "./LabelBadge";
import { useLeadStore } from "@/context/LeadStore";
import { LABEL_META, CHANNEL_META } from "@/lib/labels";
import { relativeTime } from "@/lib/format";
import type { LeadChannel, LeadLabel } from "@/lib/types";

export function LeadList() {
  const { leads } = useLeadStore();
  const [labelFilter, setLabelFilter] = useState<LeadLabel | "all">("all");
  const [channelFilter, setChannelFilter] = useState<LeadChannel | "all">(
    "all",
  );

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (labelFilter !== "all" && l.label !== labelFilter) return false;
      if (channelFilter !== "all" && l.channel !== channelFilter) return false;
      return true;
    });
  }, [leads, labelFilter, channelFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select
          value={labelFilter}
          onChange={(e) =>
            setLabelFilter(e.target.value as LeadLabel | "all")
          }
          className="input-field w-auto py-1.5"
        >
          <option value="all">All labels</option>
          {(Object.keys(LABEL_META) as LeadLabel[]).map((key) => (
            <option key={key} value={key}>
              {LABEL_META[key].label}
            </option>
          ))}
        </select>
        <select
          value={channelFilter}
          onChange={(e) =>
            setChannelFilter(e.target.value as LeadChannel | "all")
          }
          className="input-field w-auto py-1.5"
        >
          <option value="all">All channels</option>
          {(Object.keys(CHANNEL_META) as LeadChannel[]).map((key) => (
            <option key={key} value={key}>
              {CHANNEL_META[key].label}
            </option>
          ))}
        </select>
        <span className="text-[var(--geist-foreground-secondary)]">
          {filtered.length} leads
        </span>
      </div>

      <div className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--geist-border)]">
              <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
                Customer
              </th>
              <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
                Channel
              </th>
              <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
                Label
              </th>
              <th className="hidden px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)] md:table-cell">
                Job
              </th>
              <th className="px-4 py-2.5 font-medium text-[var(--geist-foreground-secondary)]">
                When
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-[var(--geist-border)] last:border-0 hover:bg-[var(--geist-background)]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="font-medium hover:underline"
                  >
                    {lead.customerName}
                  </Link>
                  <p className="text-xs text-[var(--geist-foreground-secondary)]">
                    {lead.location}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <ChannelIcon channel={lead.channel} />
                </td>
                <td className="px-4 py-3">
                  <LabelBadge label={lead.label} />
                </td>
                <td className="hidden max-w-xs truncate px-4 py-3 text-[var(--geist-foreground-secondary)] md:table-cell">
                  {lead.summary?.service ?? lead.rawMessage.slice(0, 50)}
                </td>
                <td className="px-4 py-3 text-[var(--geist-foreground-secondary)]">
                  {relativeTime(lead.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
