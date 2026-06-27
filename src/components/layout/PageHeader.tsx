import { todayFormatted } from "@/lib/format";
import { COMPANY_NAME } from "@/lib/mock-data";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--geist-border)] px-6 py-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--geist-foreground-secondary)]">
          {COMPANY_NAME} · {todayFormatted()}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--geist-foreground)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}
