import { NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/lib/ai/schema";
import { analyzeLeadOnServer } from "@/lib/ai/analyze-lead-server";

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

  try {
    const result = await analyzeLeadOnServer(
      parsed.data.message,
      parsed.data.customerName,
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("Lead analyze error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
