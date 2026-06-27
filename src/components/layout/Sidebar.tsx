"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY_NAME, BASE_OPEN_REVENUE } from "@/lib/mock-data";
import { money } from "@/lib/format";
import { LogoMark, IconInbox, IconQuotes, IconBrief } from "@/components/ui/Icons";

const NAV = [
  { href: "/dashboard/inbox", label: "Inbox", Icon: IconInbox },
  { href: "/dashboard/quotes", label: "Quotes", Icon: IconQuotes },
  { href: "/dashboard/brief", label: "Brief", Icon: IconBrief },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-[var(--geist-border)] bg-[var(--geist-background-secondary)]">
      <div className="border-b border-[var(--geist-border)] px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <div className="min-w-0">
            <span className="block text-sm font-medium">CrewPilot</span>
            <span className="block truncate text-xs text-[var(--geist-foreground-secondary)]">
              {COMPANY_NAME}
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                active
                  ? "bg-[var(--geist-border)] font-medium text-[var(--geist-foreground)]"
                  : "text-[var(--geist-foreground-secondary)] hover:bg-[var(--geist-border)] hover:text-[var(--geist-foreground)]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-70" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--geist-border)] p-3">
        <p className="text-[11px] text-[var(--geist-foreground-secondary)]">
          Open revenue
        </p>
        <p className="font-mono text-sm font-medium tabular-nums">
          {money(BASE_OPEN_REVENUE)}
        </p>
      </div>
    </aside>
  );
}
