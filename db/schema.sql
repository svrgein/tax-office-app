-- Final ERD schema for Supabase / Postgres
-- Run in Supabase SQL editor or via psql

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text,
  role text DEFAULT 'user',
  -- roles: admin, user, accountant
  CONSTRAINT users_role_check CHECK (role IN ('admin', 'user', 'accountant')),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  tax_id text,
  npwp text, -- Indonesian taxpayer number (if applicable)
  pic_name text, -- Person In Charge
  pic_email text,
  pic_phone text,
  notes text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Jobs (work items tied to clients)
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'open',
  CONSTRAINT jobs_status_check CHECK (status IN ('open','in_progress','done','cancelled')),
  due_date date,
  amount numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- Expense categories (normalized)
CREATE TABLE IF NOT EXISTS expense_categories (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  category_id integer REFERENCES expense_categories(id) ON DELETE SET NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  incurred_at date,
  receipt_url text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  issued_at date DEFAULT now(),
  invoice_number text UNIQUE,
  tax_period_start date,
  tax_period_end date,
  due_date date,
  status text DEFAULT 'draft',
  CONSTRAINT invoices_status_check CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  total numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'IDR',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Invoice items
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(12,2) DEFAULT 1,
  CONSTRAINT invoice_items_quantity_check CHECK (quantity >= 0),
  unit_price numeric(12,2) DEFAULT 0,
  CONSTRAINT invoice_items_unit_price_check CHECK (unit_price >= 0),
  total numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Ledger entries (debit/credit/saldo) — generic bookkeeping entries
CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  entry_date date NOT NULL DEFAULT current_date,
  description text,
  amount numeric(14,2) NOT NULL,
  entry_type text NOT NULL,
  CONSTRAINT ledger_entry_type_check CHECK (entry_type IN ('debit','credit')),
  balance numeric(14,2), -- optional running balance
  created_at timestamptz DEFAULT now()
);

-- Documents (file metadata)
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  name text NOT NULL,
  url text NOT NULL,
  size bigint,
  mime text,
  tags text[],
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Deadlines (calendar items)
CREATE TABLE IF NOT EXISTS deadlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  title text NOT NULL,
  due_date date NOT NULL,
  remind boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  issued_at date DEFAULT now(),
  invoice_number text UNIQUE,
  tax_period_start date,
  tax_period_end date,
  due_date date,
  status text DEFAULT 'draft',
  CONSTRAINT invoices_status_check CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  total numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'IDR',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Invoice items
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(12,2) DEFAULT 1,
  CONSTRAINT invoice_items_quantity_check CHECK (quantity >= 0),
  unit_price numeric(12,2) DEFAULT 0,
  CONSTRAINT invoice_items_unit_price_check CHECK (unit_price >= 0),
  total numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  entity_type text,
  entity_id uuid,
  action text NOT NULL,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_expenses_client_id ON expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);

-- Note: After applying this schema, regenerate types with Supabase CLI:
-- npx supabase gen types typescript --project-id <project-id> > types/database.types.ts

