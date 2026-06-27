export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-11 w-11 text-sm"
        : "h-9 w-9 text-xs";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-[var(--geist-border)] bg-[var(--geist-background)] font-medium text-[var(--geist-foreground-secondary)] ${sizeClass}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
