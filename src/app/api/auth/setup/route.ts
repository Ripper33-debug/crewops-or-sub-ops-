import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserOrg } from "@/lib/auth/session";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  try {
    const orgId = await ensureUserOrg(user.id, body.companyName);
    return NextResponse.json({ orgId });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Setup failed" },
      { status: 500 },
    );
  }
}
