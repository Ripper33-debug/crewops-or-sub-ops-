"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { LogoMark, IconArrowRight } from "@/components/ui/Icons";

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
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <span className="text-sm font-semibold">CrewPilot</span>
        </Link>
        <h1 className="mt-10 text-3xl font-semibold tracking-tight">
          Sign in to demo
        </h1>
        <p className="mt-2 text-sm text-[var(--geist-foreground-secondary)]">
          Mock login — any email gets you into the full product demo.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-sm space-y-4">
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Work email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gulfcoastpoolpros.com"
              required
              className="input-field mt-1.5"
            />
          </label>
          <button type="submit" className="btn-primary w-full">
            View demo
            <IconArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
      <div className="hidden flex-1 items-center justify-center bg-zinc-950 p-8 lg:flex">
        <div className="w-full max-w-lg scale-90">
          <ProductPreview />
        </div>
      </div>
    </div>
  );
}
