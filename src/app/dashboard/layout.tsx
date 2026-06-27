"use client";

import { useState } from "react";
import { LeadStoreProvider, useLeadStore } from "@/context/LeadStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { SubscriptionGate } from "@/components/layout/SubscriptionGate";
import { SimulateLeadModal } from "@/components/demo/SimulateLeadModal";
import { IconPlus } from "@/components/ui/Icons";
import { money } from "@/lib/format";

function TopBar({ onSimulate }: { onSimulate: () => void }) {
  const { briefStats, leads } = useLeadStore();
  const urgent = leads.filter((l) => l.label === "emergency").length;

  return (
    <div className="flex items-center justify-between border-b border-[var(--geist-border)] px-5 py-2.5">
      <div className="flex items-center gap-4 text-xs text-[var(--geist-foreground-secondary)]">
        <span>{leads.length} leads</span>
        {urgent > 0 && <span>{urgent} emergency</span>}
        <span className="font-mono tabular-nums">
          {money(briefStats.estimatedOpenRevenue)} open
        </span>
      </div>
      <button type="button" onClick={onSimulate} className="btn-primary">
        <IconPlus className="h-3.5 w-3.5" />
        New lead
      </button>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="dark-dashboard flex min-h-screen bg-[var(--geist-background)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onSimulate={() => setModalOpen(true)} />
          <SubscriptionGate>
            <main id="main-content" className="flex-1 overflow-auto">
              {children}
            </main>
          </SubscriptionGate>
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
