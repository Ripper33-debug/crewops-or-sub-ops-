import { LabelBadge } from "@/components/inbox/LabelBadge";
import { Avatar } from "@/components/ui/Avatar";
import { IconSparkle } from "@/components/ui/Icons";

const PREVIEW_LEADS = [
  {
    name: "John Miller",
    location: "Cape Coral",
    service: "Pool pump repair",
    label: "emergency" as const,
    channel: "Website",
    time: "2m ago",
  },
  {
    name: "Jennifer H.",
    location: "Fort Myers",
    service: "Pool leak — equipment pad",
    label: "emergency" as const,
    channel: "SMS",
    time: "30m ago",
  },
  {
    name: "Sarah K.",
    location: "Fort Myers",
    service: "Pool resurfacing quote",
    label: "needs_quote" as const,
    channel: "Quote req",
    time: "5d ago",
  },
  {
    name: "Lisa Chen",
    location: "Cape Coral",
    service: "Annual maintenance",
    label: "follow_up" as const,
    channel: "Past customer",
    time: "4h ago",
  },
];

export function ProductPreview() {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-emerald-500/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1 text-xs text-zinc-500">
            app.crewpilot.ai/dashboard/inbox
          </div>
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <div className="hidden w-44 shrink-0 border-r border-zinc-800 bg-zinc-900/50 p-4 sm:block">
            <p className="text-xs font-semibold text-zinc-300">CrewPilot</p>
            <p className="mt-0.5 text-[10px] text-zinc-500">Gulf Coast Pool Pros</p>
            <nav className="mt-4 space-y-1">
              {["Inbox", "Quotes", "Brief"].map((item, i) => (
                <div
                  key={item}
                  className={`rounded-md px-2 py-1.5 text-xs ${
                    i === 0
                      ? "bg-sky-500/15 font-medium text-sky-400"
                      : "text-zinc-500"
                  }`}
                >
                  {item}
                </div>
              ))}
            </nav>
            <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-2">
              <p className="text-[10px] text-zinc-500">Open revenue</p>
              <p className="font-mono text-sm font-semibold text-emerald-400">
                $9,850
              </p>
            </div>
          </div>

          {/* Inbox preview */}
          <div className="min-w-0 flex-1 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-100">Inbox</p>
                <p className="text-xs text-zinc-500">12 leads · AI prioritized</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-1 text-[10px] font-medium text-sky-400">
                <IconSparkle className="h-3 w-3" />
                AI sorted
              </div>
            </div>
            <div className="space-y-2">
              {PREVIEW_LEADS.map((lead) => (
                <div
                  key={lead.name}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-700"
                >
                  <Avatar name={lead.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-zinc-200">
                        {lead.name}
                      </p>
                      <LabelBadge label={lead.label} />
                    </div>
                    <p className="truncate text-xs text-zinc-500">
                      {lead.service} · {lead.location}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-[10px] text-zinc-600">{lead.channel}</p>
                    <p className="text-[10px] text-zinc-500">{lead.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
