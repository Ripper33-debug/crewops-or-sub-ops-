"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isDemoModeClient } from "@/lib/env-client";
import {
  BASE_OPEN_REVENUE,
  MAINTENANCE_DUE_COUNT,
  REVIEW_REQUESTS_READY,
  SEED_LEADS,
  SEED_QUOTES,
} from "@/lib/mock-data";
import { quoteAiAction } from "@/lib/db/mappers";
import type {
  BriefAction,
  BriefStats,
  CreateLeadInput,
  CreateQuoteInput,
  Lead,
  LeadAnalysis,
  Quote,
} from "@/lib/types";

interface LeadStoreValue {
  leads: Lead[];
  quotes: Quote[];
  loading: boolean;
  refresh: () => Promise<void>;
  getLead: (id: string) => Lead | undefined;
  createLead: (input: CreateLeadInput) => Promise<Lead>;
  analyzeLeadById: (
    id: string,
    override?: { rawMessage: string; customerName: string },
  ) => Promise<void>;
  sendReply: (id: string) => Promise<void>;
  markReadyToBook: (id: string) => Promise<void>;
  createQuote: (input: CreateQuoteInput) => Promise<Quote>;
  sendQuoteFollowUp: (quoteId: string) => Promise<void>;
  briefStats: BriefStats;
  briefActions: BriefAction[];
  isAnalyzing: boolean;
  aiLive: boolean | null;
}

const LeadStoreContext = createContext<LeadStoreValue | null>(null);

function sortLeads(leads: Lead[]): Lead[] {
  const order: Record<string, number> = {
    emergency: 0,
    hot_lead: 1,
    needs_quote: 2,
    follow_up: 3,
    price_shopper: 4,
    bad_fit: 5,
  };
  return [...leads].sort((a, b) => {
    const labelDiff = (order[a.label] ?? 99) - (order[b.label] ?? 99);
    if (labelDiff !== 0) return labelDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function LeadStoreProvider({ children }: { children: ReactNode }) {
  const demo = isDemoModeClient();
  const [leads, setLeads] = useState<Lead[]>(demo ? sortLeads(SEED_LEADS) : []);
  const [quotes, setQuotes] = useState<Quote[]>(demo ? SEED_QUOTES : []);
  const [briefStats, setBriefStats] = useState<BriefStats>({
    newLeadsNeedReply: 0,
    quotesToFollowUp: 0,
    reviewRequestsReady: REVIEW_REQUESTS_READY,
    maintenanceDue: MAINTENANCE_DUE_COUNT,
    estimatedOpenRevenue: BASE_OPEN_REVENUE,
  });
  const [briefActions, setBriefActions] = useState<BriefAction[]>([]);
  const [loading, setLoading] = useState(!demo);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiLive, setAiLive] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    try {
      const [leadsRes, quotesRes, briefRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/quotes"),
        fetch("/api/brief"),
      ]);
      if (leadsRes.ok) {
        const d = await leadsRes.json();
        setLeads(sortLeads(d.leads || []));
      }
      if (quotesRes.ok) {
        const d = await quotesRes.json();
        setQuotes(d.quotes || []);
      }
      if (briefRes.ok) {
        const d = await briefRes.json();
        setBriefStats(d.stats);
        setBriefActions(d.actions || []);
      }
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getLead = useCallback(
    (id: string) => leads.find((l) => l.id === id),
    [leads],
  );

  const createLead = useCallback(
    async (input: CreateLeadInput): Promise<Lead> => {
      if (demo) {
        const lead: Lead = {
          id: `lead-${Date.now()}`,
          customerName: input.customerName || "New lead",
          location: "Southwest Florida",
          channel: input.channel || "website_form",
          label: "hot_lead",
          status: "new",
          rawMessage: input.rawMessage,
          createdAt: new Date().toISOString(),
        };
        setLeads((prev) => sortLeads([lead, ...prev]));
        return lead;
      }
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      await refresh();
      return data.lead;
    },
    [demo, refresh],
  );

  const analyzeLeadById = useCallback(
    async (
      id: string,
      override?: { rawMessage: string; customerName: string },
    ) => {
      setIsAnalyzing(true);
      try {
        if (demo) {
          const { analyzeLead } = await import("@/lib/ai/analyze-lead");
          const msg =
            override?.rawMessage ||
            leads.find((l) => l.id === id)?.rawMessage ||
            "";
          const result = await analyzeLead(msg, override?.customerName);
          setAiLive(result.live);
          setLeads((prev) =>
            sortLeads(
              prev.map((l) =>
                l.id === id
                  ? {
                      ...l,
                      summary: result.analysis,
                      label: result.analysis.label,
                      customerName: result.analysis.customer,
                      location: result.analysis.location,
                      status: "summarized",
                    }
                  : l,
              ),
            ),
          );
          return;
        }
        const res = await fetch(`/api/leads/${id}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(override || {}),
        });
        const data = await res.json();
        setAiLive(data.live ?? false);
        await refresh();
      } finally {
        setIsAnalyzing(false);
      }
    },
    [demo, leads, refresh],
  );

  const sendReply = useCallback(
    async (id: string) => {
      if (demo) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status: "replied" as const } : l,
          ),
        );
        return;
      }
      await fetch(`/api/leads/${id}/send`, { method: "POST" });
      await refresh();
    },
    [demo, refresh],
  );

  const markReadyToBook = useCallback(
    async (id: string) => {
      if (demo) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === id
              ? { ...l, status: "ready_to_book" as const, label: "hot_lead" }
              : l,
          ),
        );
        return;
      }
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ready_to_book", label: "hot_lead" }),
      });
      await refresh();
    },
    [demo, refresh],
  );

  const createQuote = useCallback(
    async (input: CreateQuoteInput): Promise<Quote> => {
      if (demo) {
        const quote: Quote = {
          id: `quote-${Date.now()}`,
          leadId: input.leadId,
          customerName: input.customerName,
          job: input.job,
          amount: input.amount,
          status: "Sent just now",
          aiAction: "Wait 24 hrs",
          followUpDraft: `Hi ${input.customerName.split(" ")[0]}, here's your quote for ${input.job.toLowerCase()}.`,
          sentAt: new Date().toISOString(),
        };
        setQuotes((prev) => [quote, ...prev]);
        setLeads((prev) =>
          prev.map((l) =>
            l.id === input.leadId ? { ...l, status: "quoted" } : l,
          ),
        );
        return quote;
      }
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      await refresh();
      return data.quote;
    },
    [demo, refresh],
  );

  const sendQuoteFollowUp = useCallback(
    async (quoteId: string) => {
      if (demo) return;
      await fetch(`/api/quotes/${quoteId}/send`, { method: "POST" });
      await refresh();
    },
    [demo, refresh],
  );

  const demoBrief = useMemo(() => {
    if (!demo) return null;
    const newLeadsNeedReply = leads.filter(
      (l) => l.status === "new" || l.status === "summarized",
    ).length;
    const quotesToFollowUp = quotes.filter((q) =>
      quoteAiAction(q.sentAt).toLowerCase().includes("follow up"),
    ).length;
    return {
      stats: {
        newLeadsNeedReply,
        quotesToFollowUp,
        reviewRequestsReady: REVIEW_REQUESTS_READY,
        maintenanceDue: MAINTENANCE_DUE_COUNT,
        estimatedOpenRevenue: BASE_OPEN_REVENUE,
      } as BriefStats,
      actions: [] as BriefAction[],
    };
  }, [demo, leads, quotes]);

  const value: LeadStoreValue = {
    leads,
    quotes,
    loading,
    refresh,
    getLead,
    createLead,
    analyzeLeadById,
    sendReply,
    markReadyToBook,
    createQuote,
    sendQuoteFollowUp,
    briefStats: demo ? demoBrief!.stats : briefStats,
    briefActions: demo ? demoBrief!.actions : briefActions,
    isAnalyzing,
    aiLive,
  };

  return (
    <LeadStoreContext.Provider value={value}>
      {children}
    </LeadStoreContext.Provider>
  );
}

export function useLeadStore(): LeadStoreValue {
  const ctx = useContext(LeadStoreContext);
  if (!ctx) {
    throw new Error("useLeadStore must be used within LeadStoreProvider");
  }
  return ctx;
}
