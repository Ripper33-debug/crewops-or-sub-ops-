import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { LeadAnalysisSchema } from "@/lib/ai/schema";
import { mockAnalyzeLead } from "@/lib/ai/mock-analyze";
import { isProduction } from "@/lib/env";
import type { LeadAnalysis } from "@/lib/types";

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

export interface AnalyzeServerResult {
  analysis: LeadAnalysis;
  live: boolean;
}

export async function analyzeLeadOnServer(
  message: string,
  customerName?: string,
  serviceArea?: string,
): Promise<AnalyzeServerResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    if (isProduction()) {
      throw new Error("ANTHROPIC_API_KEY is required in production");
    }
    return { analysis: mockAnalyzeLead(message, customerName), live: false };
  }

  const area = serviceArea || "Southwest Florida";
  const client = new Anthropic({ apiKey });
  const response = await client.messages.parse({
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: `You are the front desk for a home service contractor in ${area}.
Analyze customer messages and return structured JSON.
Draft replies: short, friendly SMS tone — like a local contractor, not corporate.
Estimate job values realistically for the trade and region.`,
    messages: [
      {
        role: "user",
        content: `Analyze this lead${customerName ? ` from ${customerName}` : ""}:\n\n${message}`,
      },
    ],
    output_config: {
      format: zodOutputFormat(LeadAnalysisSchema),
    },
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    if (isProduction()) throw new Error("AI analysis failed");
    return { analysis: mockAnalyzeLead(message, customerName), live: false };
  }

  return { analysis: parsed, live: true };
}
