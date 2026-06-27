import Link from "next/link";
import { LogoMark } from "@/components/ui/Icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--geist-background)]">
      <header className="border-b border-[var(--geist-border)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-medium">CrewPilot</span>
          </Link>
          <Link href="/login" className="btn-primary">
            Open demo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Revenue desk for home service crews
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--geist-foreground-secondary)]">
          One inbox for leads. Quote follow-ups that don&apos;t slip. A daily
          brief on open revenue. Built for operators running 1–10 person crews.
        </p>
        <div className="mt-8">
          <Link href="/signup" className="btn-primary">
            Get started
          </Link>
          <Link href="/login" className="btn-ghost ml-3">
            Sign in
          </Link>
        </div>

        <section className="mt-20 border-t border-[var(--geist-border)] pt-12">
          <h2 className="text-sm font-medium text-[var(--geist-foreground)]">
            What it does
          </h2>
          <dl className="mt-6 space-y-6">
            {[
              {
                term: "Inbox",
                def: "Calls, forms, texts, and past customers in one list — labeled by urgency and job type.",
              },
              {
                term: "Lead detail",
                def: "Summary, estimated job value, recommended next step, and a draft reply you can send.",
              },
              {
                term: "Quote pipeline",
                def: "Open quotes with status and follow-up actions so nothing sits too long.",
              },
              {
                term: "Owner brief",
                def: "Morning view of replies due, quotes to chase, and total open revenue.",
              },
            ].map((item) => (
              <div key={item.term}>
                <dt className="font-medium">{item.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[var(--geist-foreground-secondary)]">
                  {item.def}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16 border-t border-[var(--geist-border)] pt-12">
          <h2 className="text-sm font-medium">Demo company</h2>
          <p className="mt-2 text-sm text-[var(--geist-foreground-secondary)]">
            Gulf Coast Pool Pros — Cape Coral, FL. Sample leads and quotes are
            pre-loaded. Use &ldquo;Simulate new lead&rdquo; in the dashboard to
            walk through the loop.
          </p>
        </section>
      </main>

      <footer className="border-t border-[var(--geist-border)] py-6 text-center text-xs text-[var(--geist-foreground-secondary)]">
        CrewPilot ·{" "}
        <Link href="/privacy" className="hover:underline">
          Privacy
        </Link>
        {" · "}
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
      </footer>
    </div>
  );
}
