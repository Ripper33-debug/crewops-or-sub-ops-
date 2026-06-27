"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLeadStore } from "@/context/LeadStore";
import { IconPlus } from "@/components/ui/Icons";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
            <IconPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Simulate new lead</h2>
            <p className="text-sm text-[var(--geist-foreground-secondary)]">
              Demo: lead → AI summary → reply → quote
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Customer name
            </span>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input-field mt-1.5"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Message
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="input-field mt-1.5 resize-none"
            />
          </label>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "Creating…" : "Create & analyze"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
