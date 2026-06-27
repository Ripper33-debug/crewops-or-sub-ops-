interface DraftReplyProps {
  draft: string;
}

export function DraftReply({ draft }: DraftReplyProps) {
  return (
    <div className="rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--geist-foreground-secondary)]">
        AI draft reply
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--geist-foreground)]">
        &ldquo;{draft}&rdquo;
      </p>
    </div>
  );
}
