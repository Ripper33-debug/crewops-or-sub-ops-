import { PageHeader } from "@/components/layout/PageHeader";
import { LeadList } from "@/components/inbox/LeadList";

export default function InboxPage() {
  return (
    <>
      <PageHeader
        title="Inbox"
        subtitle="All leads in one list, sorted by urgency"
      />
      <div className="p-6">
        <LeadList />
      </div>
    </>
  );
}
