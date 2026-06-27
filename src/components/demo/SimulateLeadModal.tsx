"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLeadStore } from "@/context/LeadStore";

interface SimulateLeadModalProps {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_MESSAGE =
  "Need pool repair in Cape Coral — pump not turning on";

export function SimulateLeadModal({ open, onClose }: SimulateLeadModalProps) {
  const router = useRouter();
  const { createLead, analyzeLeadById } = useLeadStore();
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [customerName, setCustomerName] = useState("John Miller");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const lead = createLead({
      rawMessage: message,
      customerName,
      channel: "website_form",
    });
    onClose();
    router.push(`/dashboard/leads/${lead.id}`);
    await analyzeLeadById(lead.id, {
      rawMessage: message,
      customerName,
    });
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] p-6">
        <h2 className="text-lg font-semibold">Simulate new lead</h2>
        <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
          Demo the full flow: lead → AI summary → reply → quote
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm">
            Customer name
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--geist-border)] bg-[var(--geist-background)] px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-[var(--geist-border)] bg-[var(--geist-background)] px-3 py-2"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--geist-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create & analyze"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--geist-border)] px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
