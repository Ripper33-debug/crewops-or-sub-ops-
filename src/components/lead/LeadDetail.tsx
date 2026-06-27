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
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(
    lead.summary?.estimatedValue.min ?? 550,
  );

  const summary = lead.summary;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <StatusStepper status={lead.status} />

        <div className="panel p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-medium">{lead.customerName}</h2>
              <div className="mt-1">
                <ChannelIcon channel={lead.channel} />
              </div>
            </div>
            <span className="text-xs text-[var(--geist-foreground-secondary)]">
              {relativeTime(lead.createdAt)}
            </span>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--geist-foreground-secondary)]">
            {lead.rawMessage}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {aiLive === false && summary && (
          <p className="text-xs text-[var(--geist-foreground-secondary)]">
            Using mock analysis — set ANTHROPIC_API_KEY for live output.
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
                  Ready to book
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
          <div className="panel border-dashed p-8 text-center">
            <p className="text-sm text-[var(--geist-foreground-secondary)]">
              Run analysis to get summary and draft reply.
            </p>
            <button
              type="button"
              onClick={() => analyzeLeadById(lead.id)}
              disabled={isAnalyzing}
              className="btn-primary mt-4"
            >
              {isAnalyzing ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        )}
      </div>

      {showQuoteModal && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="panel w-full max-w-md p-5">
            <h3 className="font-medium">Create quote</h3>
            <p className="mt-1 text-sm text-[var(--geist-foreground-secondary)]">
              {summary.service} — {lead.customerName}
            </p>
            <label className="mt-4 block text-sm">
              <span className="text-[var(--geist-foreground-secondary)]">
                Amount
              </span>
              <input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                className="input-field mt-1 tabular-nums"
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
