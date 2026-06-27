"use client";

import { useState } from "react";
import { useLeadStore } from "@/context/LeadStore";
import { ChannelIcon } from "@/components/inbox/ChannelIcon";
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
  const [pasteMessage, setPasteMessage] = useState("");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(
    lead.summary?.estimatedValue.min ?? 550,
  );

  const summary = lead.summary;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <StatusStepper status={lead.status} />
        </div>

        <div className="rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--geist-foreground)]">
              {lead.customerName}
            </h2>
            <span className="text-xs text-[var(--geist-foreground-secondary)]">
              {relativeTime(lead.createdAt)}
            </span>
          </div>
          <div className="mt-2">
            <ChannelIcon channel={lead.channel} />
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--geist-foreground-secondary)]">
            {lead.rawMessage}
          </p>
        </div>

        {!summary && (
          <div className="rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--geist-foreground-secondary)]">
              Paste customer message
            </p>
            <textarea
              value={pasteMessage}
              onChange={(e) => setPasteMessage(e.target.value)}
              placeholder="Paste a customer message to analyze…"
              rows={3}
              className="mt-2 w-full rounded-lg border border-[var(--geist-border)] bg-[var(--geist-background)] px-3 py-2 text-sm text-[var(--geist-foreground)]"
            />
            <button
              type="button"
              onClick={() => analyzeLeadById(lead.id)}
              disabled={isAnalyzing}
              className="mt-3 rounded-lg bg-[var(--geist-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {aiLive === false && summary && (
          <p className="rounded-lg border border-amber-800/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-300">
            Using mock AI — add ANTHROPIC_API_KEY to .env.local for live analysis.
          </p>
        )}
        {aiLive === true && (
          <p className="rounded-lg border border-emerald-800/30 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-300">
            Live AI analysis enabled.
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
                  className="rounded-lg bg-[var(--geist-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Send reply
                </button>
              )}
              {lead.status === "replied" && (
                <button
                  type="button"
                  onClick={() => markReadyToBook(lead.id)}
                  className="rounded-lg border border-[var(--geist-border-strong)] px-4 py-2 text-sm font-medium text-[var(--geist-foreground)] hover:bg-[var(--geist-border)]"
                >
                  Mark ready to book
                </button>
              )}
              {lead.status !== "quoted" && (
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="rounded-lg border border-[var(--geist-border-strong)] px-4 py-2 text-sm font-medium text-[var(--geist-foreground)] hover:bg-[var(--geist-border)]"
                >
                  Create quote
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--geist-border)] p-8 text-center">
            <p className="text-sm text-[var(--geist-foreground-secondary)]">
              Run AI analysis to see summary and draft reply.
            </p>
            <button
              type="button"
              onClick={() => analyzeLeadById(lead.id)}
              disabled={isAnalyzing}
              className="mt-4 rounded-lg bg-[var(--geist-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing…" : "Analyze lead"}
            </button>
          </div>
        )}
      </div>

      {showQuoteModal && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--geist-border)] bg-[var(--geist-background-secondary)] p-6">
            <h3 className="text-lg font-semibold">Create quote</h3>
            <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
              {summary.service} for {lead.customerName}
            </p>
            <label className="mt-4 block text-sm">
              Amount
              <input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[var(--geist-border)] bg-[var(--geist-background)] px-3 py-2 tabular-nums"
              />
            </label>
            <div className="mt-4 flex gap-2">
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
                className="rounded-lg bg-[var(--geist-accent)] px-4 py-2 text-sm font-medium text-white"
              >
                Add to pipeline
              </button>
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="rounded-lg border border-[var(--geist-border)] px-4 py-2 text-sm"
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
