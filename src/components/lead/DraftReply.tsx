interface DraftReplyProps {
  draft: string;
}

export function DraftReply({ draft }: DraftReplyProps) {
  return (
    <div className="panel p-5">
      <p className="text-xs text-[var(--geist-foreground-secondary)]">
        Draft reply
      </p>
      <p className="mt-2 text-sm leading-relaxed">{draft}</p>
    </div>
  );
}
