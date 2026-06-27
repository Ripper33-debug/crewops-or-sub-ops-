interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="panel p-4">
      <p className="text-xs text-[var(--geist-foreground-secondary)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-medium tabular-nums">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-[var(--geist-foreground-secondary)]">
          {sub}
        </p>
      )}
    </div>
  );
}
