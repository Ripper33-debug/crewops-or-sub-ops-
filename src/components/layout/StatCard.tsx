interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--geist-foreground-secondary)]">
        {label}
      </p>
      <p
        className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${accent ?? "text-[var(--geist-foreground)]"}`}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
          {sub}
        </p>
      )}
    </div>
  );
}
