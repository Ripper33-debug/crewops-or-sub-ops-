"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { analyzeLead } from "@/lib/ai/analyze-lead";
import {
  BASE_OPEN_REVENUE,
  MAINTENANCE_DUE_COUNT,
  REVIEW_REQUESTS_READY,
  SEED_LEADS,
  SEED_QUOTES,
} from "@/lib/mock-data";
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
  getLead: (id: string) => Lead | undefined;
  createLead: (input: CreateLeadInput) => Lead;
  analyzeLeadById: (
    id: string,
    override?: { rawMessage: string; customerName: string },
  ) => Promise<void>;
  analyzeMessage: (message: string, customerName?: string) => Promise<LeadAnalysis>;
  sendReply: (id: string) => void;
  markReadyToBook: (id: string) => void;
  createQuote: (input: CreateQuoteInput) => Quote;
  briefStats: BriefStats;
  briefActions: BriefAction[];
  isAnalyzing: boolean;
  aiLive: boolean | null;
}

const LeadStoreContext = createContext<LeadStoreValue | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

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
  const [leads, setLeads] = useState<Lead[]>(() => sortLeads(SEED_LEADS));
  const [quotes, setQuotes] = useState<Quote[]>(SEED_QUOTES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiLive, setAiLive] = useState<boolean | null>(null);

  const getLead = useCallback(
    (id: string) => leads.find((l) => l.id === id),
    [leads],
  );

  const createLead = useCallback((input: CreateLeadInput): Lead => {
    const lead: Lead = {
      id: generateId("lead"),
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
  }, []);

  const analyzeMessage = useCallback(
    async (message: string, customerName?: string): Promise<LeadAnalysis> => {
      setIsAnalyzing(true);
      try {
        const result = await analyzeLead(message, customerName);
        setAiLive(result.live);
        return result.analysis;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  const analyzeLeadById = useCallback(
    async (
      id: string,
      override?: { rawMessage: string; customerName: string },
    ) => {
      setIsAnalyzing(true);
      try {
        let rawMessage = override?.rawMessage ?? "";
        let customerName = override?.customerName ?? "";
        if (!rawMessage) {
          const found = leads.find((l) => l.id === id);
          if (!found) return;
          rawMessage = found.rawMessage;
          customerName = found.customerName;
        }

        const result = await analyzeLead(rawMessage, customerName);
        setAiLive(result.live);
        const summary = result.analysis;
        setLeads((prev) =>
          sortLeads(
            prev.map((l) =>
              l.id === id
                ? {
                    ...l,
                    summary,
                    label: summary.label,
                    customerName: summary.customer,
                    location: summary.location,
                    status: l.status === "new" ? "summarized" : l.status,
                  }
                : l,
            ),
          ),
        );
      } finally {
        setIsAnalyzing(false);
      }
    },
    [leads],
  );

  const sendReply = useCallback((id: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "replied" as const } : l,
      ),
    );
  }, []);

  const markReadyToBook = useCallback((id: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: "ready_to_book" as const, label: "hot_lead" as const }
          : l,
      ),
    );
  }, []);

  const createQuote = useCallback((input: CreateQuoteInput): Quote => {
    const quote: Quote = {
      id: generateId("quote"),
      leadId: input.leadId,
      customerName: input.customerName,
      job: input.job,
      amount: input.amount,
      status: "Sent just now",
      aiAction: "Wait 24 hrs",
      followUpDraft: `Hi ${input.customerName.split(" ")[0]}, here's your quote for ${input.job.toLowerCase()}. Let us know if you have any questions!`,
      sentAt: new Date().toISOString(),
    };
    setQuotes((prev) => [quote, ...prev]);
    setLeads((prev) =>
      prev.map((l) =>
        l.id === input.leadId ? { ...l, status: "quoted" as const } : l,
      ),
    );
    return quote;
  }, []);

  const briefStats = useMemo((): BriefStats => {
    const newLeadsNeedReply = leads.filter(
      (l) => l.status === "new" || l.status === "summarized",
    ).length;
    const quotesToFollowUp = quotes.filter((q) =>
      q.aiAction.toLowerCase().includes("follow up"),
    ).length;
    const newQuoteRevenue = quotes
      .filter((q) => q.status === "Sent just now")
      .reduce((sum, q) => sum + q.amount, 0);

    return {
      newLeadsNeedReply,
      quotesToFollowUp,
      reviewRequestsReady: REVIEW_REQUESTS_READY,
      maintenanceDue: MAINTENANCE_DUE_COUNT,
      estimatedOpenRevenue: BASE_OPEN_REVENUE + newQuoteRevenue,
    };
  }, [leads, quotes]);

  const briefActions = useMemo((): BriefAction[] => {
    const actions: BriefAction[] = [];

    leads
      .filter((l) => l.status === "new" || l.status === "summarized")
      .slice(0, 3)
      .forEach((l) => {
        actions.push({
          id: `action-lead-${l.id}`,
          text: `Reply to ${l.customerName} — ${l.summary?.service ?? "new lead"}`,
          href: `/dashboard/leads/${l.id}`,
          priority: l.label === "emergency" ? "high" : "medium",
        });
      });

    quotes
      .filter((q) => q.aiAction.toLowerCase().includes("follow up"))
      .slice(0, 2)
      .forEach((q) => {
        actions.push({
          id: `action-quote-${q.id}`,
          text: `Follow up with ${q.customerName} on ${q.job} (${q.status})`,
          href: q.leadId ? `/dashboard/leads/${q.leadId}` : "/dashboard/quotes",
          priority: "high",
        });
      });

    actions.push({
      id: "action-review",
      text: "Send review request to Karen S. (job completed last week)",
      href: "/dashboard/leads/lead-11",
      priority: "low",
    });

    actions.push({
      id: "action-maintenance",
      text: "4 past customers due for annual maintenance",
      href: "/dashboard/inbox?filter=past_customer",
      priority: "medium",
    });

    return actions;
  }, [leads, quotes]);

  const value: LeadStoreValue = {
    leads,
    quotes,
    getLead,
    createLead,
    analyzeLeadById,
    analyzeMessage,
    sendReply,
    markReadyToBook,
    createQuote,
    briefStats,
    briefActions,
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
