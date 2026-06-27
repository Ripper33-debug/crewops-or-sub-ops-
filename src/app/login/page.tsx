"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("crewpilot-demo-session", "1");
    }
    router.push("/dashboard/inbox");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--geist-background)] px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="text-sm text-[var(--geist-foreground-secondary)] hover:text-[var(--geist-foreground)]"
        >
          ← CrewPilot
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Sign in to demo
        </h1>
        <p className="mt-2 text-sm text-[var(--geist-foreground-secondary)]">
          Mock login — any email works
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full rounded-lg border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--geist-accent)] py-3 text-sm font-medium text-white hover:opacity-90"
          >
            View demo
          </button>
        </form>
      </div>
    </div>
  );
}
