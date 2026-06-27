"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/Icons";

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
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-sm font-medium">CrewPilot</span>
        </Link>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Demo login</h1>
        <p className="mt-2 text-sm text-[var(--geist-foreground-secondary)]">
          Any email works. No password.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="input-field mt-1"
            />
          </label>
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
