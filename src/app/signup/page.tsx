"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoMark } from "@/components/ui/Icons";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || "Signup failed");
      setLoading(false);
      return;
    }

    const setup = await fetch("/api/auth/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName }),
    });

    if (!setup.ok) {
      const d = await setup.json();
      setError(d.error || "Setup failed");
      setLoading(false);
      return;
    }

    router.push("/dashboard/billing");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-sm font-medium">CrewPilot</span>
        </Link>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Create account
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Company name
            </span>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="input-field mt-1"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field mt-1"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--geist-foreground-secondary)]">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input-field mt-1"
            />
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--geist-foreground-secondary)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--geist-accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
