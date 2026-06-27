import { todayFormatted } from "@/lib/format";
import { COMPANY_NAME } from "@/lib/mock-data";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--geist-border)] px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--geist-foreground-secondary)]">
            {COMPANY_NAME} · {todayFormatted()}
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
