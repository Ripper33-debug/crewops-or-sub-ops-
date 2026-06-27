import type { LeadAnalysis } from "../types";
import { mockAnalyzeLead } from "./mock-analyze";

export interface AnalyzeResult {
  analysis: LeadAnalysis;
  live: boolean;
}

export async function analyzeLead(
  message: string,
  customerName?: string,
): Promise<AnalyzeResult> {
  try {
    const res = await fetch("/api/lead/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, customerName }),
    });

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();
    if (data.analysis) {
      return { analysis: data.analysis, live: data.live ?? false };
    }
    throw new Error("No analysis");
  } catch {
    return {
      analysis: mockAnalyzeLead(message, customerName),
      live: false,
    };
  }
}
