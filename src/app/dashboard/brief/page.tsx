import { PageHeader } from "@/components/layout/PageHeader";
import { OwnerBrief } from "@/components/brief/OwnerBrief";

export default function BriefPage() {
  return (
    <>
      <PageHeader
        title="Daily Owner Brief"
        subtitle="Where revenue is sitting and what to do today"
      />
      <div className="p-6">
        <OwnerBrief />
      </div>
    </>
  );
}
