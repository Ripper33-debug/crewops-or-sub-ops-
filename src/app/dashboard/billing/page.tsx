"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { isDemoModeClient } from "@/lib/env-client";

export default function BillingPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoModeClient()) return;
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        setStatus(d.subscriptionStatus || "");
        if (d.active) router.replace("/dashboard/inbox");
      });
  }, [router]);

  async function startCheckout() {
    setLoading(true);
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  }

  return (
    <>
      <PageHeader
        title="Billing"
        subtitle="Subscribe to use CrewPilot with your team"
      />
      <div className="p-5">
        <div className="panel max-w-md p-6">
          <p className="text-2xl font-semibold tabular-nums">$99/mo</p>
          <p className="mt-2 text-sm text-[var(--geist-foreground-secondary)]">
            Inbox, lead summaries, quote follow-ups, and owner brief. Cancel
            anytime.
          </p>
          {status && (
            <p className="mt-2 text-xs text-[var(--geist-foreground-secondary)]">
              Current status: {status}
            </p>
          )}
          <button
            type="button"
            onClick={startCheckout}
            disabled={loading || isDemoModeClient()}
            className="btn-primary mt-6"
          >
            {loading ? "Loading…" : "Subscribe"}
          </button>
          {isDemoModeClient() && (
            <p className="mt-3 text-xs text-[var(--geist-foreground-secondary)]">
              Demo mode — billing disabled until Supabase is configured.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
