import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import {
  AnalyzeRequestSchema,
  LeadAnalysisSchema,
} from "@/lib/ai/schema";
import { mockAnalyzeLead } from "@/lib/ai/mock-analyze";

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

async function analyzeWithAnthropic(
  message: string,
  customerName?: string,
): Promise<{ analysis: ReturnType<typeof mockAnalyzeLead>; live: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      analysis: mockAnalyzeLead(message, customerName),
      live: false,
    };
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.parse({
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: `You are the AI front desk for Gulf Coast Pool Pros, a pool service company in Southwest Florida (Cape Coral, Fort Myers, Naples).
Analyze incoming customer messages and return structured JSON.
Be concise. Draft replies should sound like a friendly local contractor via SMS — short, professional, no corporate jargon.
Estimate job values realistically for Florida pool/home service work.`,
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
    return {
      analysis: mockAnalyzeLead(message, customerName),
      live: false,
    };
  }

  return { analysis: parsed, live: true };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { message, customerName } = parsed.data;
  const provider = process.env.AI_PROVIDER ?? "anthropic";

  try {
    if (provider === "anthropic") {
      const result = await analyzeWithAnthropic(message, customerName);
      return NextResponse.json(result);
    }

    // OpenAI path: fall back to mock until key is configured
    if (process.env.OPENAI_API_KEY) {
      // Placeholder — mock for now; extend when OPENAI_API_KEY is set
      return NextResponse.json({
        analysis: mockAnalyzeLead(message, customerName),
        live: false,
        note: "OpenAI provider not fully wired — using mock",
      });
    }

    return NextResponse.json({
      analysis: mockAnalyzeLead(message, customerName),
      live: false,
    });
  } catch (err) {
    console.error("Lead analyze error:", err);
    return NextResponse.json({
      analysis: mockAnalyzeLead(message, customerName),
      live: false,
      error: "AI unavailable, using mock",
    });
  }
}
