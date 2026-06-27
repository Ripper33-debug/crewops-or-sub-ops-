import type { LeadAnalysis, LeadLabel } from "../types";

function detectLabel(message: string): LeadLabel {
  const lower = message.toLowerCase();
  if (
    lower.includes("emergency") ||
    lower.includes("leaking") ||
    lower.includes("not turning on") ||
    lower.includes("asap")
  ) {
    return "emergency";
  }
  if (lower.includes("quote") || lower.includes("how much")) {
    return "needs_quote";
  }
  if (lower.includes("cheapest") || lower.includes("compare")) {
    return "price_shopper";
  }
  if (lower.includes("follow") || lower.includes("checking back")) {
    return "follow_up";
  }
  if (lower.includes("commercial") || lower.includes("hotel")) {
    return "bad_fit";
  }
  return "hot_lead";
}

function detectLocation(message: string): string {
  const locations = [
    "Cape Coral",
    "Fort Myers",
    "Naples",
    "Bonita Springs",
    "Estero",
    "Lehigh Acres",
  ];
  for (const loc of locations) {
    if (message.toLowerCase().includes(loc.toLowerCase())) {
      return `${loc}, FL`;
    }
  }
  return "Southwest Florida";
}

function detectService(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("pump")) return "Pool pump repair";
  if (lower.includes("resurfac")) return "Pool resurfacing";
  if (lower.includes("heater")) return "Pool heater repair";
  if (lower.includes("clean") || lower.includes("maintenance"))
    return "Pool maintenance";
  if (lower.includes("landscap")) return "Landscaping";
  if (lower.includes("ac ") || lower.includes("air condition"))
    return "AC repair";
  if (lower.includes("filter")) return "Pool filter service";
  return "Pool service";
}

function estimateValue(service: string, label: LeadLabel): { min: number; max: number } {
  if (service.includes("resurfacing")) return { min: 5500, max: 8500 };
  if (service.includes("Landscaping")) return { min: 800, max: 2500 };
  if (service.includes("AC")) return { min: 350, max: 650 };
  if (label === "emergency") return { min: 350, max: 800 };
  if (service.includes("maintenance")) return { min: 150, max: 350 };
  return { min: 250, max: 600 };
}

export function mockAnalyzeLead(
  message: string,
  customerName?: string,
): LeadAnalysis {
  const service = detectService(message);
  const label = detectLabel(message);
  const location = detectLocation(message);
  const customer = customerName || "New lead";
  const value = estimateValue(service, label);

  const recommendedAction =
    label === "emergency"
      ? "Call back within 15 min + ask for pump photo"
      : label === "needs_quote"
        ? "Send quote request form + schedule site visit"
        : label === "bad_fit"
          ? "Politely decline — outside service area or scope"
          : "Send booking link + ask for pump photo";

  const draftReply =
    label === "emergency"
      ? `Hey ${customer.split(" ")[0]}, we can help with that today. Can you send a photo of the pump and let us know if it's leaking or not turning on?`
      : label === "needs_quote"
        ? `Hi ${customer.split(" ")[0]}, thanks for reaching out about ${service.toLowerCase()}. We'd love to take a look — what's the best time for a quick site visit this week?`
        : `Hey ${customer.split(" ")[0]}, we can help with that. Can you send a photo and let us know if it's leaking or not turning on?`;

  return {
    customer,
    location,
    service,
    urgency:
      label === "emergency"
        ? "Today"
        : label === "hot_lead"
          ? "This week"
          : "Flexible",
    estimatedValue: value,
    label,
    recommendedAction,
    draftReply,
  };
}
