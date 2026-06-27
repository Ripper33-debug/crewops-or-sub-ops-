"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChannelIcon } from "./ChannelIcon";
import { LabelBadge } from "./LabelBadge";
import { Avatar } from "@/components/ui/Avatar";
import { useLeadStore } from "@/context/LeadStore";
import { LABEL_META, CHANNEL_META } from "@/lib/labels";
import { relativeTime } from "@/lib/format";
import type { LeadChannel, LeadLabel } from "@/lib/types";

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30"
          : "bg-white/[0.03] text-[var(--geist-foreground-secondary)] ring-1 ring-[var(--geist-border)] hover:text-[var(--geist-foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

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

  const counts = useMemo(() => {
    const emergency = leads.filter((l) => l.label === "emergency").length;
    const hot = leads.filter((l) => l.label === "hot_lead").length;
    return { emergency, hot, total: leads.length };
  }, [leads]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total leads", value: counts.total, color: "text-sky-400" },
          { label: "Emergency", value: counts.emergency, color: "text-red-400" },
          { label: "Hot leads", value: counts.hot, color: "text-orange-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-panel rounded-xl px-4 py-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--geist-foreground-secondary)]">
              {s.label}
            </p>
            <p className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={labelFilter === "all"}
          onClick={() => setLabelFilter("all")}
        >
          All labels
        </FilterPill>
        {(Object.keys(LABEL_META) as LeadLabel[]).map((key) => (
          <FilterPill
            key={key}
            active={labelFilter === key}
            onClick={() => setLabelFilter(key)}
          >
            {LABEL_META[key].label}
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={channelFilter === "all"}
          onClick={() => setChannelFilter("all")}
        >
          All channels
        </FilterPill>
        {(Object.keys(CHANNEL_META) as LeadChannel[]).map((key) => (
          <FilterPill
            key={key}
            active={channelFilter === key}
            onClick={() => setChannelFilter(key)}
          >
            {CHANNEL_META[key].label}
          </FilterPill>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((lead, i) => (
          <Link
            key={lead.id}
            href={`/dashboard/leads/${lead.id}`}
            className="group flex animate-fade-up items-center gap-4 rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)]/60 p-4 transition-all hover:border-sky-500/30 hover:bg-[var(--geist-background-secondary)] hover:shadow-lg hover:shadow-sky-500/5"
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <Avatar name={lead.customerName} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-[var(--geist-foreground)] group-hover:text-sky-400">
                  {lead.customerName}
                </p>
                <LabelBadge label={lead.label} />
              </div>
              <p className="mt-0.5 truncate text-sm text-[var(--geist-foreground-secondary)]">
                {lead.summary?.service ?? lead.rawMessage}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ChannelIcon channel={lead.channel} />
                <span className="text-[11px] text-[var(--geist-foreground-secondary)]">
                  {lead.location}
                </span>
              </div>
            </div>
            <div className="hidden shrink-0 text-right sm:block">
              <p className="text-xs text-[var(--geist-foreground-secondary)]">
                {relativeTime(lead.createdAt)}
              </p>
              <p className="mt-1 text-[11px] capitalize text-zinc-500">
                {lead.status.replace(/_/g, " ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
