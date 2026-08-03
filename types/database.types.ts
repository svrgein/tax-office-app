/**
 * Supabase database types — generated from schema.clean.sql
 * To regenerate after schema changes:
 *   npx supabase gen types typescript --project-id hkqwfoemndyidebwbrms > types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          tax_id: string | null;
          npwp: string | null;
          pic_name: string | null;
          pic_email: string | null;
          pic_phone: string | null;
          status: 'active' | 'at_risk' | 'on_hold';
          tax_status: 'compliant' | 'needs_review' | 'pending_audit';
          notes: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          tax_id?: string | null;
          npwp?: string | null;
          pic_name?: string | null;
          pic_email?: string | null;
          pic_phone?: string | null;
          status?: 'active' | 'at_risk' | 'on_hold';
          tax_status?: 'compliant' | 'needs_review' | 'pending_audit';
          notes?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          tax_id?: string | null;
          npwp?: string | null;
          pic_name?: string | null;
          pic_email?: string | null;
          pic_phone?: string | null;
          status?: 'active' | 'at_risk' | 'on_hold';
          tax_status?: 'compliant' | 'needs_review' | 'pending_audit';
          notes?: string | null;
          metadata?: Json | null;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          title: string;
          description: string | null;
          status: 'open' | 'in_progress' | 'done' | 'cancelled';
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          amount: number;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'open' | 'in_progress' | 'done' | 'cancelled';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          amount?: number;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'open' | 'in_progress' | 'done' | 'cancelled';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          amount?: number;
          progress?: number;
          updated_at?: string;
        };
      };
      expense_categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          job_id: string | null;
          category_id: number | null;
          description: string;
          amount: number;
          type: 'debit' | 'credit';
          incurred_at: string;
          receipt_url: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_id?: string | null;
          job_id?: string | null;
          category_id?: number | null;
          description: string;
          amount: number;
          type?: 'debit' | 'credit';
          incurred_at?: string;
          receipt_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          client_id?: string | null;
          job_id?: string | null;
          category_id?: number | null;
          description?: string;
          amount?: number;
          type?: 'debit' | 'credit';
          incurred_at?: string;
          receipt_url?: string | null;
          metadata?: Json | null;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          invoice_number: string | null;
          issued_at: string;
          due_date: string | null;
          tax_period_start: string | null;
          tax_period_end: string | null;
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          total: number;
          currency: string;
          notes: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_id?: string | null;
          invoice_number?: string | null;
          issued_at?: string;
          due_date?: string | null;
          tax_period_start?: string | null;
          tax_period_end?: string | null;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          total?: number;
          currency?: string;
          notes?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string | null;
          invoice_number?: string | null;
          issued_at?: string;
          due_date?: string | null;
          tax_period_start?: string | null;
          tax_period_end?: string | null;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          total?: number;
          currency?: string;
          notes?: string | null;
          metadata?: Json | null;
          updated_at?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          total: number;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity?: number;
          unit_price?: number;
        };
        Update: {
          description?: string;
          quantity?: number;
          unit_price?: number;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          job_id: string | null;
          name: string;
          storage_path: string;
          url: string;
          size: number | null;
          mime: string | null;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_id?: string | null;
          job_id?: string | null;
          name: string;
          storage_path: string;
          url: string;
          size?: number | null;
          mime?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          client_id?: string | null;
          job_id?: string | null;
          name?: string;
          tags?: string[] | null;
        };
      };
      deadlines: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          job_id: string | null;
          title: string;
          due_date: string;
          priority: 'low' | 'medium' | 'high';
          remind: boolean;
          status: 'upcoming' | 'done' | 'overdue';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_id?: string | null;
          job_id?: string | null;
          title: string;
          due_date: string;
          priority?: 'low' | 'medium' | 'high';
          remind?: boolean;
          status?: 'upcoming' | 'done' | 'overdue';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          client_id?: string | null;
          job_id?: string | null;
          title?: string;
          due_date?: string;
          priority?: 'low' | 'medium' | 'high';
          remind?: boolean;
          status?: 'upcoming' | 'done' | 'overdue';
          notes?: string | null;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          entity_type: string | null;
          entity_id: string | null;
          action: string;
          changes: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          action: string;
          changes?: Json | null;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      client_status: 'active' | 'at_risk' | 'on_hold';
      client_tax_status: 'compliant' | 'needs_review' | 'pending_audit';
      job_status: 'open' | 'in_progress' | 'done' | 'cancelled';
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
      priority_level: 'low' | 'medium' | 'high';
      expense_type: 'debit' | 'credit';
      deadline_status: 'upcoming' | 'done' | 'overdue';
    };
    CompositeTypes: Record<string, never>;
  };
};
