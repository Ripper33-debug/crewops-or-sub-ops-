"use client";

import { useState } from "react";
import { useLeadStore } from "@/context/LeadStore";
import { ChannelIcon } from "@/components/inbox/ChannelIcon";
import { Avatar } from "@/components/ui/Avatar";
import { DraftReply } from "./DraftReply";
import { LeadSummaryPanel } from "./LeadSummaryPanel";
import { StatusStepper } from "./StatusStepper";
import { relativeTime } from "@/lib/format";
import type { Lead } from "@/lib/types";

interface LeadDetailProps {
  lead: Lead;
}

export function LeadDetail({ lead }: LeadDetailProps) {
  const {
    analyzeLeadById,
    sendReply,
    markReadyToBook,
    createQuote,
    isAnalyzing,
    aiLive,
  } = useLeadStore();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(
    lead.summary?.estimatedValue.min ?? 550,
  );

  const summary = lead.summary;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <StatusStepper status={lead.status} />

        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-start gap-4">
            <Avatar name={lead.customerName} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{lead.customerName}</h2>
                <span className="shrink-0 text-xs text-[var(--geist-foreground-secondary)]">
                  {relativeTime(lead.createdAt)}
                </span>
              </div>
              <div className="mt-2">
                <ChannelIcon channel={lead.channel} />
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-black/20 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--geist-foreground-secondary)]">
              {lead.rawMessage}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {aiLive === false && summary && (
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
            Mock AI active — add ANTHROPIC_API_KEY for live analysis
          </p>
        )}
        {aiLive === true && (
          <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            Live AI analysis enabled
          </p>
        )}

        {summary ? (
          <>
            <LeadSummaryPanel summary={summary} isAnalyzing={isAnalyzing} />
            <DraftReply draft={summary.draftReply} />

            <div className="flex flex-wrap gap-2">
              {lead.status !== "replied" && lead.status !== "quoted" && (
                <button
                  type="button"
                  onClick={() => sendReply(lead.id)}
                  className="btn-primary"
                >
                  Send reply
                </button>
              )}
              {lead.status === "replied" && (
                <button
                  type="button"
                  onClick={() => markReadyToBook(lead.id)}
                  className="btn-secondary"
                >
                  Mark ready to book
                </button>
              )}
              {lead.status !== "quoted" && (
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="btn-secondary"
                >
                  Create quote
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="glass-panel rounded-xl border-dashed p-10 text-center">
            <p className="text-sm text-[var(--geist-foreground-secondary)]">
              Run AI analysis to generate summary and draft reply
            </p>
            <button
              type="button"
              onClick={() => analyzeLeadById(lead.id)}
              disabled={isAnalyzing}
              className="btn-primary mt-5"
            >
              {isAnalyzing ? "Analyzing…" : "Analyze lead"}
            </button>
          </div>
        )}
      </div>

      {showQuoteModal && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6">
            <h3 className="text-lg font-semibold">Create quote</h3>
            <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
              {summary.service} for {lead.customerName}
            </p>
            <label className="mt-5 block text-sm">
              <span className="text-[var(--geist-foreground-secondary)]">
                Amount
              </span>
              <input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                className="input-field mt-1.5 tabular-nums"
              />
            </label>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  createQuote({
                    leadId: lead.id,
                    customerName: lead.customerName,
                    job: summary.service,
                    amount: quoteAmount,
                  });
                  setShowQuoteModal(false);
                }}
                className="btn-primary"
              >
                Add to pipeline
              </button>
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
