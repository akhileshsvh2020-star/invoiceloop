# InvoiceLoop Case Study

## Problem

Freelancers and small service businesses often track invoices across spreadsheets, email threads, and manual reminders. That makes it easy to lose sight of which clients have paid, which invoices are still open, and which payments are overdue. InvoiceLoop focuses on that exact operational pain: giving a small business owner a clear billing workspace they can open, understand, and act on quickly.

## Approach

I chose InvoiceLoop because it is CRUD-rich, dashboard-heavy, and close to a real business workflow. The product is intentionally narrow: clients, invoices, payment status, reports, and CSV export. That helped keep the experience polished instead of spreading effort across too many unfinished features.

The app uses Next.js App Router, TypeScript, Tailwind CSS, Prisma, and Supabase Postgres. Data is modeled around one demo user who owns clients and invoices. Clients can have many invoices, and invoices carry status, amount, due date, and line-item details. The dashboard then calculates collection health from real database records instead of static mock numbers.

Authentication is handled with a seeded demo account, scrypt-hashed password storage, server-created sessions, and an httpOnly cookie. Protected pages check the current user on the server before rendering. For the trial, this keeps review friction low while still showing real auth behavior.

The main trade-off was choosing depth over scope. I did not add every possible billing feature, such as payment gateway integration or recurring automation. Instead, I focused on a complete reviewer flow: sign in, understand the dashboard, manage clients, create and update invoices, review reports, export CSV data, and sign out.

## Result

InvoiceLoop is deployed publicly and connected to a real Supabase Postgres database.

- Live app: https://invoiceloop.vercel.app
- GitHub repo: https://github.com/akhileshsvh2020-star/invoiceloop
- Demo login: demo@invoiceloop.app / InvoiceLoop@2026

Completed product features include:

- Authenticated demo login with protected dashboard pages.
- Client create, edit, and delete workflows.
- Invoice create, edit, delete, search, and status tracking.
- Dashboard metrics for collected, outstanding, overdue, open invoices, and average paid time.
- Reports page for collection summaries and client revenue.
- CSV export for invoice data.
- Responsive UI with hover, focus, loading, and disabled states.
- README, architecture notes, changelog, license, contributing guide, SEO metadata, sitemap, robots file, and custom 404 page.

## What I Learned

This task made the difference between a demo and a shipped product very clear. A working form is not enough; the reviewer needs fast feedback, safe defaults, clean documentation, and a live deployment that works without explanation.

The biggest lesson was around production readiness. Local code can feel finished, but deployment exposes details like environment variables, database connection strings, seeded production data, and login latency. Adding an immediate "Signing in..." state improved confidence for users even when the server takes a moment to respond.

I also learned that small product decisions matter. Naming the primary action "Create invoice", keeping demo credentials visible, using clear status labels, and keeping the case study and README easy to scan all make the app easier to evaluate. The project is now something a reviewer can open, test, and understand without needing a walkthrough.
