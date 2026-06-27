"use client";

import { useState } from "react";
import { LeadStoreProvider, useLeadStore } from "@/context/LeadStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { SimulateLeadModal } from "@/components/demo/SimulateLeadModal";
import { IconPlus, IconSparkle } from "@/components/ui/Icons";
import { money } from "@/lib/format";

function TopBar({ onSimulate }: { onSimulate: () => void }) {
  const { briefStats, leads } = useLeadStore();
  const urgent = leads.filter((l) => l.label === "emergency").length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--geist-border)] px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        {urgent > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            {urgent} emergency
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--geist-border)] bg-white/[0.03] px-3 py-1 text-xs text-[var(--geist-foreground-secondary)]">
          <IconSparkle className="h-3 w-3 text-sky-400" />
          {leads.length} leads in pipeline
        </span>
        <span className="hidden font-mono text-xs tabular-nums text-emerald-400 sm:inline">
          {money(briefStats.estimatedOpenRevenue)} open
        </span>
      </div>
      <button type="button" onClick={onSimulate} className="btn-primary">
        <IconPlus className="h-4 w-4" />
        Simulate new lead
      </button>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="dark-dashboard dashboard-grid flex min-h-screen bg-[var(--geist-background)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onSimulate={() => setModalOpen(true)} />
          <main id="main-content" className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <SimulateLeadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LeadStoreProvider>
      <DashboardShell>{children}</DashboardShell>
    </LeadStoreProvider>
  );
}
