import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--geist-background)]">
      <header className="border-b border-[var(--geist-border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight">CrewPilot</span>
          <Link
            href="/login"
            className="rounded-lg bg-[var(--geist-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            View demo
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--geist-accent)]">
            AI revenue desk for home service crews
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Turn calls, forms, quotes, and old customers into booked jobs
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--geist-foreground-secondary)]">
            Not an AI receptionist. Not an automation agency. The command center
            for small contractors who are too busy to answer every lead, follow
            up every quote, and manage every customer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-[var(--geist-accent)] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              View demo
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-[var(--geist-border-strong)] px-6 py-3 text-sm font-medium hover:bg-[var(--geist-background-secondary)]"
            >
              See how it works
            </a>
          </div>
        </section>

        <section
          id="features"
          className="border-t border-[var(--geist-border)] bg-[var(--geist-background-secondary)] py-20"
        >
          <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-3">
            {[
              {
                title: "Unified inbox",
                desc: "Missed calls, forms, Facebook leads, texts, and past customers — AI-labeled and prioritized.",
              },
              {
                title: "Quote follow-up",
                desc: "See open quotes, who's gone quiet, and exactly what to say to close the job.",
              },
              {
                title: "Daily owner brief",
                desc: "Every morning: leads to reply, quotes to chase, and how much revenue is sitting open.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background)] p-6"
              >
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--geist-foreground-secondary)]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--geist-border)] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Built for 1–10 person crews
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--geist-foreground-secondary)]">
              ServiceTitan and Jobber prove contractors pay for lead-to-cash
              software. CrewPilot is simpler, cheaper, and AI-first — starting
              with pool companies in Florida.
            </p>
            <div className="mt-8 rounded-xl border border-[var(--geist-border)] bg-zinc-950 p-6 text-sm text-zinc-300">
              <p className="font-medium text-zinc-100">Demo flow</p>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-zinc-400">
                <li>Customer submits: &ldquo;Need pool repair in Cape Coral&rdquo;</li>
                <li>CrewPilot creates the lead and AI summarizes the job</li>
                <li>AI drafts the reply — you send it in one click</li>
                <li>Quote goes out — AI follows up if it sits too long</li>
                <li>Owner brief shows open revenue across the pipeline</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--geist-border)] bg-[var(--geist-background-secondary)] py-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-2xl font-semibold">Ready to see it?</h2>
            <p className="mt-2 text-[var(--geist-foreground-secondary)]">
              Mock login — explore the full demo in under 2 minutes.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-lg bg-[var(--geist-accent)] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            >
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
