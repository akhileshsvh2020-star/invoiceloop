# InvoiceLoop

> A focused invoice and payment-tracking dashboard for freelancers and small service businesses.

**Live demo:** coming after Vercel deployment  
**Demo login:** demo@invoiceloop.app / demo1234

Built for the Digital Heroes full-stack developer trial.

## Features

- Track collected, outstanding, and overdue invoice totals.
- Manage invoices across draft, sent, paid, and overdue states.
- Review client billing health from a compact dashboard.
- Search invoice records and prepare exports.
- Designed with responsive, keyboard-friendly UI patterns.

## Tech Stack

Next.js App Router, TypeScript, Tailwind CSS, React, planned Supabase/Postgres auth and data layer.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Environment Variables

| Variable | Description |
| --- | --- |
| NEXT_PUBLIC_APP_URL | Public app URL used for canonical links and metadata. |
| DATABASE_URL | Postgres connection string for the production data layer. |
| AUTH_SECRET | Secret used by the auth provider/session layer. |

## Architecture

See [docs/architecture.md](docs/architecture.md) for the planned data model and authorization notes.

## Project Plan

See [plan.md](plan.md) for scope, acceptance criteria, and build milestones.

## Testing

```bash
pnpm lint
pnpm build
```

## Roadmap

- [x] Product plan and dashboard shell.
- [ ] Database schema and seed data.
- [ ] Auth and protected routes.
- [ ] Client CRUD.
- [ ] Invoice CRUD.
- [ ] Search, filters, pagination, and export.
- [ ] Deployment, screenshots, demo video, and case study.

## License

MIT - see [LICENSE](LICENSE).
