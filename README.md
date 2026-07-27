# Tax Office Management System

Internal management platform for tax consultants — Client CRM, Tax Jobs, Deadlines,
Expenses, Documents, Invoices, Reminders, Dashboard, and Excel export.

Built for real Indonesian tax consultant workflows. See `CLAUDE.md` in the project
root for the full product and engineering spec.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui + Lucide React
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Row Level Security)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Supabase project URL and anon key from
**Supabase Dashboard → Project Settings → API**.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Folder Structure

```
app/          → Next.js App Router routes (pages, layouts, route handlers)
components/   → Shared/reusable UI components
  ui/         → shadcn/ui primitives (added via `npx shadcn@latest add <component>`)
  layout/     → Sidebar, navbar, breadcrumb, shell components
  shared/     → Cross-feature reusable components (DataTable, EmptyState, etc.)
features/     → Feature modules (clients, jobs, deadlines, expenses, documents,
                invoices, reminders, dashboard) — each self-contained
lib/          → Core libraries (Supabase clients, utils)
hooks/        → Shared React hooks
services/     → Data access layer — Supabase queries/mutations per feature
types/        → Shared TypeScript types, including generated database.types.ts
utils/        → Pure helper functions (formatting, validation helpers, etc.)
docs/         → Project documentation
```

## Adding shadcn/ui components

```bash
npx shadcn@latest add button input select dialog alert-dialog dropdown-menu tooltip badge card table pagination skeleton
```

## Database

Table names and RLS policies are defined per the schema module. Once generated,
regenerate types with:

```bash
npx supabase gen types typescript --project-id <project-id> > types/database.types.ts
```

## Status

This is the initial project scaffold. Feature modules (Authentication, Dashboard,
Client CRM, etc.) are built incrementally — see `docs/` for module-by-module notes.
