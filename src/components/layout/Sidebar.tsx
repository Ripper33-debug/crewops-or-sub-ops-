"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY_NAME } from "@/lib/mock-data";

const NAV = [
  { href: "/dashboard/inbox", label: "Inbox", icon: "📥" },
  { href: "/dashboard/quotes", label: "Quote Pipeline", icon: "📊" },
  { href: "/dashboard/brief", label: "Owner Brief", icon: "☀️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--geist-border)] bg-[var(--geist-background-secondary)]">
      <div className="border-b border-[var(--geist-border)] px-4 py-5">
        <Link href="/" className="block">
          <span className="text-sm font-semibold tracking-tight text-[var(--geist-foreground)]">
            CrewPilot
          </span>
          <span className="mt-0.5 block truncate text-xs text-[var(--geist-foreground-secondary)]">
            {COMPANY_NAME}
          </span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[var(--geist-border)] font-medium text-[var(--geist-foreground)]"
                  : "text-[var(--geist-foreground-secondary)] hover:bg-[var(--geist-border)] hover:text-[var(--geist-foreground)]"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
