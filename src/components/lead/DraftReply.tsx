interface DraftReplyProps {
  draft: string;
}

export function DraftReply({ draft }: DraftReplyProps) {
  return (
    <div className="glass-panel rounded-xl p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--geist-foreground-secondary)]">
        AI draft reply
      </p>
      <blockquote className="mt-3 border-l-2 border-sky-500/50 pl-4 text-sm leading-relaxed text-[var(--geist-foreground)]">
        {draft}
      </blockquote>
      <p className="mt-3 text-[11px] text-[var(--geist-foreground-secondary)]">
        Ready to send via SMS or email
      </p>
    </div>
  );
}
