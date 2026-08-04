const PLACEHOLDER_URL = "https://hkqwfoemndyidebwbrms.supabase.co";
const PLACEHOLDER_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcXdmb2VtbmR5aWRlYndicm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2ODUzODYsImV4cCI6MjEwMTI2MTM4Nn0.-vqQJsXjgVIZLegXaBz7fiTd8pmr-19Fs5B-yGAhJowplaceholder";

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (raw && isValidHttpUrl(raw)) return raw;
  return PLACEHOLDER_URL;
}

export function getSupabaseAnonKey(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (raw) return raw;
  return PLACEHOLDER_ANON_KEY;
}
