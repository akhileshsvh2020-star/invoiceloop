# InvoiceLoop

> A focused invoice and payment-tracking dashboard for freelancers and small service businesses.

**Live demo:** coming after Vercel deployment  
**Demo login:** demo@invoiceloop.app / demo1234

Built for Digital Heroes digitalheroesco.com training task.

## Features

- Track collected, outstanding, and overdue invoice totals.
- Manage invoices across draft, sent, paid, and overdue states.
- Review client billing health from a compact dashboard.
- Search invoice records and prepare exports.
- Designed with responsive, keyboard-friendly UI patterns.

## Tech Stack

Next.js App Router, TypeScript, Tailwind CSS, React, Prisma, and SQLite for the local persisted data layer.

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
| DATABASE_URL | Prisma database URL. Defaults to `file:./dev.db` for local SQLite. |
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
- [x] Database schema and seed data.
- [ ] Auth and protected routes.
- [x] Client CRUD.
- [x] Invoice CRUD.
- [ ] Client CRUD.
- [x] Search and filters.
- [ ] Pagination and export.
- [ ] Deployment, screenshots, demo video, and case study.

## License

MIT - see [LICENSE](LICENSE).
