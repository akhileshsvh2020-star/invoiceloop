# InvoiceLoop

> A focused invoice and payment-tracking dashboard for freelancers and small service businesses.

**Live demo:** https://invoiceloop.vercel.app  
**Demo login:** demo@invoiceloop.app / InvoiceLoop@2026

Built for Digital Heroes digitalheroesco.com training task.

## Features

- Track collected, outstanding, and overdue invoice totals.
- Sign in with a seeded demo account backed by httpOnly session cookies.
- Manage invoices across draft, sent, paid, and overdue states.
- Create, edit, and delete billing clients.
- Review client billing health from a compact dashboard.
- Search invoice records and export filtered CSV files.
- Review reports for invoice status and client revenue.
- Ship crawl basics with metadata, sitemap, robots rules, and a custom 404.
- Designed with responsive, keyboard-friendly UI patterns.

## Tech Stack

Next.js App Router, TypeScript, Tailwind CSS, React, Prisma, Supabase Postgres, Zod, and Node crypto password/session utilities.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

Open http://localhost:3000.

## Environment Variables

| Variable | Description |
| --- | --- |
| NEXT_PUBLIC_APP_URL | Public app URL used for canonical links and metadata. |
| DATABASE_URL | Supabase transaction pooler URL for the running app. |
| DIRECT_URL | Supabase session pooler URL for Prisma schema pushes and migrations. |
| AUTH_SECRET | Secret used by the auth provider/session layer. |

## Architecture

See [docs/architecture.md](docs/architecture.md) for the planned data model and authorization notes.

## Case Study

See [docs/case-study.md](docs/case-study.md) for the problem, approach, result, and learning report.

## Project Plan

See [plan.md](plan.md) for scope, acceptance criteria, and build milestones.

## Testing

```bash
pnpm lint
pnpm build
```

## Roadmap

- [x] Product plan and dashboard shell.
- [x] Database schema and seed data.
- [x] Auth and protected routes.
- [x] Client CRUD.
- [x] Invoice CRUD.
- [x] Search and filters.
- [x] CSV export.
- [x] Reports page.
- [x] SEO basics and custom 404.
- [ ] Pagination.
- [x] Deployment and case study.
- [ ] Screenshots and demo video.

## License

MIT - see [LICENSE](LICENSE).
