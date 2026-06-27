"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { isDemoModeClient } from "@/lib/env-client";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isDemoModeClient()) {
      setOrgName("Gulf Coast Pool Pros");
      setServiceArea("Southwest Florida");
      setWebhookUrl(`${window.location.origin}/api/webhooks/form/demo-token`);
      return;
    }
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        setOrgName(d.orgName || "");
        setServiceArea(d.serviceArea || "");
        if (d.formWebhookSecret) {
          setWebhookUrl(
            `${window.location.origin}/api/webhooks/form/${d.formWebhookSecret}`,
          );
        }
      });
  }, []);

  async function save() {
    await fetch("/api/org", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName, serviceArea }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Company and integrations" />
      <div className="space-y-6 p-5">
        <div className="panel max-w-lg space-y-4 p-5">
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Company name
            </span>
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="input-field mt-1"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Service area
            </span>
            <input
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              className="input-field mt-1"
            />
          </label>
          <button type="button" onClick={save} className="btn-primary">
            {saved ? "Saved" : "Save"}
          </button>
        </div>

        <div className="panel max-w-lg p-5">
          <p className="text-sm font-medium">Form webhook</p>
          <p className="mt-1 text-xs text-[var(--geist-foreground-secondary)]">
            POST JSON: name, phone, message, location (optional), sms_consent
            (optional)
          </p>
          <code className="mt-3 block break-all rounded border border-[var(--geist-border)] bg-[var(--geist-background)] p-3 text-xs">
            {webhookUrl}
          </code>
        </div>

        <div className="panel max-w-lg p-5">
          <p className="text-sm font-medium">Launch checklist</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--geist-foreground-secondary)]">
            <li>Subscribe via Billing</li>
            <li>Add webhook to website contact form</li>
            <li>Submit test lead — verify inbox + summary</li>
            <li>Send test reply to your phone</li>
            <li>Create quote and send follow-up</li>
          </ul>
        </div>
      </div>
    </>
  );
}
