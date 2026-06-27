import { ProductPreview } from "@/components/marketing/ProductPreview";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 marketing-grid" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-medium text-sky-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            AI revenue desk for home service crews
          </div>
          <h1
            className="animate-fade-up mt-6 text-4xl font-semibold tracking-tight text-[var(--geist-foreground)] sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            Turn every lead into a{" "}
            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              booked job
            </span>
          </h1>
          <p
            className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--geist-foreground-secondary)]"
            style={{ animationDelay: "0.1s" }}
          >
            The command center for contractors too busy to answer every call,
            follow up every quote, and chase every customer. Not a receptionist.
            Not an agency. A revenue desk.
          </p>
        </div>
        <div
          className="animate-fade-up mt-14"
          style={{ animationDelay: "0.15s" }}
        >
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
