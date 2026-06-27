import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/session";
import { getStripe, getStripePriceId } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  const priceId = getStripePriceId();
  if (!stripe || !priceId) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/inbox?billing=success`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
    customer_email: undefined,
    metadata: { org_id: session.orgId },
    subscription_data: {
      metadata: { org_id: session.orgId },
    },
  });

  return NextResponse.json({ url: checkout.url });
}
