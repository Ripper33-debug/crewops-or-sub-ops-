import { todayFormatted } from "@/lib/format";
import { COMPANY_NAME } from "@/lib/mock-data";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--geist-border)] px-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--geist-foreground-secondary)]">
            {COMPANY_NAME} · {todayFormatted()}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--geist-foreground)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-xl text-sm text-[var(--geist-foreground-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
