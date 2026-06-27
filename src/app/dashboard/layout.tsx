"use client";

import { useState } from "react";
import { LeadStoreProvider } from "@/context/LeadStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { SimulateLeadModal } from "@/components/demo/SimulateLeadModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <LeadStoreProvider>
      <div className="dark-dashboard flex min-h-screen bg-[var(--geist-background)]">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <div className="flex justify-end border-b border-[var(--geist-border)] px-6 py-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-[var(--geist-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Simulate new lead
            </button>
          </div>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
        <SimulateLeadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </LeadStoreProvider>
  );
}
