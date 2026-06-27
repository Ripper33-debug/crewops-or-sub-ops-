export function isDemoModeClient(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}
