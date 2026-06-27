import { z } from "zod";

export const LeadAnalysisSchema = z.object({
  customer: z.string(),
  location: z.string(),
  service: z.string(),
  urgency: z.string(),
  estimatedValue: z.object({
    min: z.number(),
    max: z.number(),
  }),
  label: z.enum([
    "hot_lead",
    "needs_quote",
    "price_shopper",
    "emergency",
    "follow_up",
    "bad_fit",
  ]),
  recommendedAction: z.string(),
  draftReply: z.string(),
});

export type LeadAnalysisOutput = z.infer<typeof LeadAnalysisSchema>;

export const AnalyzeRequestSchema = z.object({
  message: z.string().min(1),
  channel: z.string().optional(),
  customerName: z.string().optional(),
});
