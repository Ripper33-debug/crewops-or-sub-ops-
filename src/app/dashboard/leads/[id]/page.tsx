"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeadDetail } from "@/components/lead/LeadDetail";
import { useLeadStore } from "@/context/LeadStore";

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getLead } = useLeadStore();
  const lead = getLead(id);

  if (!lead) {
    return (
      <>
        <PageHeader title="Lead not found" />
        <div className="p-6">
          <Link
            href="/dashboard/inbox"
            className="text-sm text-[var(--geist-accent)] hover:underline"
          >
            ← Back to inbox
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={lead.customerName}
        subtitle={lead.location}
        action={
          <Link
            href="/dashboard/inbox"
            className="text-sm text-[var(--geist-foreground-secondary)] hover:text-[var(--geist-foreground)]"
          >
            ← Inbox
          </Link>
        }
      />
      <div className="p-6">
        <LeadDetail lead={lead} />
      </div>
    </>
  );
}
