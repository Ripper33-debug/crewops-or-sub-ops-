interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: StatCardProps) {
  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--geist-foreground-secondary)]">
          {label}
        </p>
        {icon}
      </div>
      <p
        className={`mt-2 font-mono text-3xl font-semibold tabular-nums tracking-tight ${accent ?? "text-[var(--geist-foreground)]"}`}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs text-[var(--geist-foreground-secondary)]">
          {sub}
        </p>
      )}
    </div>
  );
}
