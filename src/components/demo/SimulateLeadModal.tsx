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
    const lead = await createLead({
      rawMessage: message,
      customerName,
      channel: "website_form",
      smsConsent: true,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="panel w-full max-w-lg p-5">
        <h2 className="font-medium">New lead</h2>
        <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
          Adds a lead and runs analysis.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Name
            </span>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input-field mt-1"
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
              className="input-field mt-1 resize-none"
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Creating…" : "Create"}
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
