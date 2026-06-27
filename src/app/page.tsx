import Link from "next/link";
import { LandingHero } from "@/components/marketing/LandingHero";
import { LogoMark, IconArrowRight } from "@/components/ui/Icons";

const FEATURES = [
  {
    title: "Unified inbox",
    desc: "Missed calls, forms, Facebook, texts, and past customers — AI-labeled and prioritized automatically.",
    icon: "📥",
    accent: "from-sky-500/20 to-blue-500/5",
  },
  {
    title: "Quote follow-up",
    desc: "See who's gone quiet, what to say, and copy AI-drafted follow-ups in one click.",
    icon: "📊",
    accent: "from-emerald-500/20 to-teal-500/5",
  },
  {
    title: "Daily owner brief",
    desc: "Every morning: leads to reply, quotes to chase, and exactly how much revenue is open.",
    icon: "☀️",
    accent: "from-amber-500/20 to-orange-500/5",
  },
];

const FLOW = [
  "Customer submits: Need pool repair in Cape Coral",
  "CrewPilot creates the lead + AI summary",
  "AI drafts the reply — send in one click",
  "Quote goes out — AI follows up if it sits",
  "Owner brief shows open revenue across pipeline",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--geist-background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--geist-border)] bg-[var(--geist-background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="text-sm font-semibold tracking-tight">
              CrewPilot
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">
              Sign in
            </Link>
            <Link href="/login" className="btn-primary">
              View demo
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <LandingHero />

        <section className="border-t border-[var(--geist-border)] py-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-xs text-[var(--geist-foreground-secondary)]">
            <span>Built for 1–10 person crews</span>
            <span className="hidden h-3 w-px bg-[var(--geist-border)] sm:block" />
            <span>Starting with pool companies in Florida</span>
            <span className="hidden h-3 w-px bg-[var(--geist-border)] sm:block" />
            <span>Simpler than ServiceTitan · Smarter than spreadsheets</span>
          </div>
        </section>

        <section id="features" className="border-t border-[var(--geist-border)] py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-center text-sm font-medium uppercase tracking-widest text-sky-600">
              Core loop
            </p>
            <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
              Lead → reply → quote → revenue
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className={`group rounded-2xl border border-[var(--geist-border)] bg-gradient-to-b ${f.accent} p-6 transition-shadow hover:shadow-lg hover:shadow-black/5`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--geist-foreground-secondary)]">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--geist-border)] bg-zinc-950 py-24 text-zinc-100">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
                Demo flow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                See the full loop in under 2 minutes
              </h2>
              <p className="mt-4 text-zinc-400">
                ServiceTitan and Jobber prove contractors pay for lead-to-cash
                software. CrewPilot is the AI-first version for crews who
                don&apos;t need enterprise bloat.
              </p>
              <Link href="/login" className="btn-primary mt-8">
                Run the demo
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ol className="space-y-3">
              {FLOW.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/15 font-mono text-xs font-semibold text-sky-400">
                    {i + 1}
                  </span>
                  <span className="text-sm text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[var(--geist-border)] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to show your cofounder?
            </h2>
            <p className="mt-3 text-[var(--geist-foreground-secondary)]">
              Mock login — explore inbox, AI summaries, quote pipeline, and
              owner brief.
            </p>
            <Link href="/login" className="btn-primary mt-8">
              View demo
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--geist-border)] py-8 text-center text-xs text-[var(--geist-foreground-secondary)]">
        CrewPilot AI — AI revenue desk for home service businesses
      </footer>
    </div>
  );
}
