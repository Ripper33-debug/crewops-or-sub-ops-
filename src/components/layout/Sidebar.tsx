"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY_NAME, BASE_OPEN_REVENUE } from "@/lib/mock-data";
import { money } from "@/lib/format";
import { LogoMark, IconInbox, IconQuotes, IconBrief } from "@/components/ui/Icons";

const NAV = [
  { href: "/dashboard/inbox", label: "Inbox", Icon: IconInbox },
  { href: "/dashboard/quotes", label: "Quote Pipeline", Icon: IconQuotes },
  { href: "/dashboard/brief", label: "Owner Brief", Icon: IconBrief },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--geist-border)] bg-[var(--geist-background-secondary)]/80 backdrop-blur-xl">
      <div className="border-b border-[var(--geist-border)] px-4 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <div className="min-w-0">
            <span className="block text-sm font-semibold tracking-tight">
              CrewPilot
            </span>
            <span className="block truncate text-[11px] text-[var(--geist-foreground-secondary)]">
              {COMPANY_NAME}
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-sky-500/10 font-medium text-sky-400 shadow-sm shadow-sky-500/5"
                  : "text-[var(--geist-foreground-secondary)] hover:bg-white/[0.04] hover:text-[var(--geist-foreground)]"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-sky-400" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--geist-border)] p-4">
        <div className="glass-panel rounded-xl p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--geist-foreground-secondary)]">
            Open revenue
          </p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-emerald-400">
            {money(BASE_OPEN_REVENUE)}
          </p>
          <p className="mt-1 text-[10px] text-[var(--geist-foreground-secondary)]">
            Updates as you work leads
          </p>
        </div>
      </div>
    </aside>
  );
}
