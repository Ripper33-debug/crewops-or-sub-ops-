export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isDemoMode(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.DEMO_MODE === "true" || !hasSupabase();
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
