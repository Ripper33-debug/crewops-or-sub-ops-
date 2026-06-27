import { PageHeader } from "@/components/layout/PageHeader";
import { QuotePipelineTable } from "@/components/quotes/QuotePipelineTable";

export default function QuotesPage() {
  return (
    <>
      <PageHeader
        title="Quote Follow-Up Pipeline"
        subtitle="Open quotes and AI-recommended next actions"
      />
      <div className="p-6">
        <QuotePipelineTable />
      </div>
    </>
  );
}
