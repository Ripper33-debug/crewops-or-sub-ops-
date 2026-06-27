"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isDemoModeClient } from "@/lib/env-client";

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isDemoModeClient()) {
      setChecked(true);
      return;
    }
    if (pathname.startsWith("/dashboard/billing")) {
      setChecked(true);
      return;
    }
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        if (!d.active) router.replace("/dashboard/billing");
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--geist-foreground-secondary)]">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
