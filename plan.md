# InvoiceLoop Plan

## Product
InvoiceLoop is an invoicing and payment-tracking dashboard for freelancers and small service businesses. It helps users manage clients, create invoices, track payment status, and understand cash flow at a glance.

## Primary User
A freelancer or small agency owner who sends multiple invoices per month and wants one simple place to see what is paid, unpaid, overdue, and coming due.

## Core Jobs
- Add and manage clients.
- Create invoices for client work.
- Track invoices across draft, sent, paid, and overdue states.
- Search, filter, and sort invoice records.
- Export invoice data for accounting.
- View revenue and collection health from a dashboard.

## Screens
- Landing/dashboard shell with cash-flow summary.
- Invoice table with search, filters, status, amount, and due date.
- Client list and client detail summary.
- Invoice create/edit form.
- Settings/profile area.
- Auth screens: sign up, login, password reset, email verification.

## MVP Acceptance Criteria
- A visitor can use a demo login without friction.
- Auth protects dashboard routes.
- Users can create, read, update, and delete clients.
- Users can create, read, update, and delete invoices.
- Invoice status updates are reflected in dashboard metrics.
- Invoice lists support server-side search, filters, sorting, and pagination.
- Every async screen has loading, empty, error, and success states.
- App is responsive from 320px up and keyboard navigable.
- README includes live URL, screenshots, setup, env vars, and demo credentials.
- Repository includes LICENSE, CONTRIBUTING, CHANGELOG, and .env.example.

## Data Model Draft
- users: id, name, email, password_hash or auth_provider_id, email_verified_at, created_at, updated_at.
- clients: id, user_id, name, email, company, phone, billing_address, status, created_at, updated_at, deleted_at.
- invoices: id, user_id, client_id, invoice_number, title, issue_date, due_date, status, subtotal, tax_rate, total, notes, created_at, updated_at, deleted_at.
- invoice_items: id, invoice_id, description, quantity, unit_price, amount, created_at, updated_at.
- activity_logs: id, user_id, entity_type, entity_id, action, metadata, created_at.

## Recommended Stack
- Next.js App Router.
- TypeScript strict mode.
- Tailwind CSS.
- Supabase Auth and Postgres, or Prisma with Neon and Auth.js.
- Zod for validation.
- Vercel for deployment.
- Playwright for one critical-path e2e test.

## Build Milestones
1. Product shell, dashboard UI, and docs foundation.
2. Database schema, seed data, and typed data access.
3. Auth and protected dashboard routes.
4. Client CRUD.
5. Invoice CRUD and invoice item editing.
6. Search, filter, sort, pagination, and export.
7. Testing, accessibility pass, SEO, README, screenshots, deployment.
