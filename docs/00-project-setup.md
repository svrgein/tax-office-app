# Project Setup — Log

## Status: Done

Initial scaffold created per `CLAUDE.md` spec.

### What was set up

- Next.js 15 (App Router) + React 19 + TypeScript strict mode
- Tailwind CSS with design tokens matching the design system in `CLAUDE.md`:
  - Border radius: 12px (`--radius: 0.75rem`)
  - Colors: Primary Blue, Background/Card White, Border Gray, Success Green,
    Warning Orange, Danger Red — all as CSS variables (light + dark mode)
  - Font: Inter (via `next/font/google`)
- shadcn/ui configuration (`components.json`, `lib/utils.ts` with `cn()` helper)
  — no components installed yet, add them as each module needs them
- Supabase client setup for App Router (`@supabase/ssr`):
  - `lib/supabase/client.ts` — browser client (Client Components)
  - `lib/supabase/server.ts` — server client (Server Components/Actions)
  - `lib/supabase/middleware.ts` + root `middleware.ts` — session refresh
- Folder structure exactly per spec: `app/ components/ features/ lib/ hooks/
  services/ types/ utils/ docs/`
- Placeholder routes so the app runs without errors:
  - `/` → redirects to `/dashboard`
  - `/dashboard` — placeholder page
  - `/auth/login` — placeholder page
  - `/auth/callback` — Supabase auth redirect handler (real logic added with
    the Authentication module)
- `types/database.types.ts` — placeholder Supabase types, to be regenerated
  once the database schema module is built

### Not yet built (by design — one module at a time)

- Database schema (tables: users, clients, jobs, deadlines, expenses,
  expense_categories, documents, document_types, invoices, invoice_items,
  reminders, activity_logs) + RLS policies
- Authentication (real login/logout/session logic)
- Dashboard content
- Client CRM, Expenses, Documents, Invoice, Reminder features
- shadcn/ui components (installed on demand per module)

### Next recommended step

Database schema module — everything else (Auth, RLS, features) depends on it.
