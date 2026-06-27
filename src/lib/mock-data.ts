import type { Lead, Quote } from "./types";

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600000).toISOString();
const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86400000).toISOString();

export const SEED_LEADS: Lead[] = [
  {
    id: "lead-1",
    customerName: "John Miller",
    location: "Cape Coral, FL",
    channel: "website_form",
    label: "emergency",
    status: "summarized",
    rawMessage:
      "Need pool repair in Cape Coral — pump not turning on. Pool is green and we have guests this weekend.",
    summary: {
      customer: "John Miller",
      location: "Cape Coral, FL",
      service: "Pool pump repair",
      urgency: "This week",
      estimatedValue: { min: 350, max: 800 },
      label: "emergency",
      recommendedAction: "Send booking link + ask for pump photo",
      draftReply:
        "Hey John, we can help with that. Can you send a photo of the pump and let us know if it's leaking or not turning on?",
    },
    createdAt: hoursAgo(2),
  },
  {
    id: "lead-2",
    customerName: "Sarah K.",
    location: "Fort Myers, FL",
    channel: "quote_request",
    label: "needs_quote",
    status: "quoted",
    rawMessage:
      "Looking for a quote on pool resurfacing. About 15,000 gal pool, pebble finish preferred.",
    createdAt: daysAgo(5),
  },
  {
    id: "lead-3",
    customerName: "Mike R.",
    location: "Naples, FL",
    channel: "facebook",
    label: "hot_lead",
    status: "replied",
    rawMessage:
      "Saw your ad — need landscaping around the pool area. About 400 sq ft.",
    createdAt: daysAgo(2),
  },
  {
    id: "lead-4",
    customerName: "Amanda P.",
    location: "Bonita Springs, FL",
    channel: "sms",
    label: "follow_up",
    status: "quoted",
    rawMessage: "Following up on the AC repair quote you sent last week.",
    createdAt: daysAgo(1),
  },
  {
    id: "lead-5",
    customerName: "Unknown caller",
    location: "Estero, FL",
    channel: "missed_call",
    label: "hot_lead",
    status: "new",
    rawMessage:
      "Voicemail: Hi, this is Dave from Estero. Pool heater stopped working. Call me back at 239-555-0142.",
    createdAt: hoursAgo(1),
  },
  {
    id: "lead-6",
    customerName: "Lisa Chen",
    location: "Cape Coral, FL",
    channel: "past_customer",
    label: "follow_up",
    status: "new",
    rawMessage:
      "Hi! You serviced our pool last year. Time for annual maintenance — filter clean and equipment check.",
    createdAt: hoursAgo(4),
  },
  {
    id: "lead-7",
    customerName: "Tom W.",
    location: "Lehigh Acres, FL",
    channel: "website_form",
    label: "price_shopper",
    status: "summarized",
    rawMessage:
      "What's your cheapest price for weekly pool cleaning? Getting quotes from 3 companies.",
    createdAt: hoursAgo(6),
  },
  {
    id: "lead-8",
    customerName: "Grand Resort LLC",
    location: "Miami, FL",
    channel: "website_form",
    label: "bad_fit",
    status: "closed",
    rawMessage:
      "Commercial hotel pool maintenance contract — 3 pools, 24/7 service required.",
    createdAt: daysAgo(3),
  },
  {
    id: "lead-9",
    customerName: "Jennifer H.",
    location: "Fort Myers, FL",
    channel: "sms",
    label: "emergency",
    status: "new",
    rawMessage: "Pool is leaking badly from the equipment pad. Need someone ASAP!",
    createdAt: hoursAgo(0.5),
  },
  {
    id: "lead-10",
    customerName: "Robert D.",
    location: "Naples, FL",
    channel: "facebook",
    label: "needs_quote",
    status: "summarized",
    rawMessage: "How much to replace a pool pump? Mine is 15 years old.",
    createdAt: hoursAgo(8),
  },
  {
    id: "lead-11",
    customerName: "Karen S.",
    location: "Cape Coral, FL",
    channel: "past_customer",
    label: "hot_lead",
    status: "ready_to_book",
    rawMessage:
      "Ready to schedule the heater repair we talked about. Any openings Friday?",
    createdAt: daysAgo(1),
  },
  {
    id: "lead-12",
    customerName: "Chris B.",
    location: "Estero, FL",
    channel: "missed_call",
    label: "follow_up",
    status: "replied",
    rawMessage:
      "Voicemail: Checking back on my quote for pool resurfacing. Let me know status.",
    createdAt: daysAgo(2),
  },
];

export const SEED_QUOTES: Quote[] = [
  {
    id: "quote-1",
    leadId: "lead-2",
    customerName: "Sarah K.",
    job: "Pool resurfacing",
    amount: 6800,
    status: "No reply 3 days",
    aiAction: "Follow up today",
    followUpDraft:
      "Hi Sarah, just checking in on the pool resurfacing quote we sent. Happy to answer any questions — would you like to schedule a call?",
    sentAt: daysAgo(5),
  },
  {
    id: "quote-2",
    leadId: "lead-3",
    customerName: "Mike R.",
    job: "Landscaping",
    amount: 1200,
    status: "Viewed quote",
    aiAction: "Ask if he wants Friday",
    followUpDraft:
      "Hey Mike, saw you viewed the landscaping quote. We have a crew available Friday — want us to lock that in?",
    sentAt: daysAgo(2),
  },
  {
    id: "quote-3",
    leadId: "lead-4",
    customerName: "Amanda P.",
    job: "AC repair",
    amount: 450,
    status: "Sent yesterday",
    aiAction: "Wait 24 hrs",
    followUpDraft:
      "Hi Amanda, following up on the AC repair quote. Let me know if you have any questions!",
    sentAt: daysAgo(1),
  },
  {
    id: "quote-4",
    leadId: "lead-10",
    customerName: "Robert D.",
    job: "Pool pump replacement",
    amount: 1850,
    status: "No reply 2 days",
    aiAction: "Follow up today",
    followUpDraft:
      "Hi Robert, wanted to follow up on the pump replacement quote. We can get you scheduled this week if you're ready.",
    sentAt: daysAgo(3),
  },
  {
    id: "quote-5",
    leadId: "lead-12",
    customerName: "Chris B.",
    job: "Pool resurfacing",
    amount: 7200,
    status: "Viewed quote",
    aiAction: "Ask about timeline",
    followUpDraft:
      "Hey Chris, saw you checked out the resurfacing quote. What timeline works best for you?",
    sentAt: daysAgo(4),
  },
  {
    id: "quote-6",
    customerName: "Pat M.",
    job: "Pool heater install",
    amount: 3200,
    status: "Sent 5 days ago",
    aiAction: "Follow up today",
    followUpDraft:
      "Hi Pat, checking in on the heater install quote. Let us know if you'd like to move forward!",
    sentAt: daysAgo(5),
  },
];

export const COMPANY_NAME = "Gulf Coast Pool Pros";

export const BASE_OPEN_REVENUE = 9850;

export const MAINTENANCE_DUE_COUNT = 4;
export const REVIEW_REQUESTS_READY = 1;
