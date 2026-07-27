/**
 * Placeholder Supabase database types.
 *
 * Regenerate this file once the database schema module is built, using:
 *   npx supabase gen types typescript --project-id <project-id> > types/database.types.ts
 *
 * Keeping a minimal valid shape here so the Supabase clients stay type-safe
 * in the meantime.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
