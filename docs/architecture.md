# Architecture

InvoiceLoop is a single Next.js application with server-rendered pages, typed server actions, Prisma, and a relational database. The app keeps the product surface small: clients, invoices, dashboard metrics, and activity logs.

## Data Relationships

```mermaid
erDiagram
  users ||--o{ clients : owns
  users ||--o{ invoices : owns
  users ||--o{ activity_logs : records
  clients ||--o{ invoices : receives
  invoices ||--o{ invoice_items : contains

  users {
    string id
    string name
    string email
    datetime email_verified_at
    datetime created_at
    datetime updated_at
  }

  clients {
    string id
    string user_id
    string name
    string email
    string company
    string status
    datetime deleted_at
  }

  invoices {
    string id
    string user_id
    string client_id
    string invoice_number
    string status
    decimal total
    datetime due_date
    datetime deleted_at
  }

  invoice_items {
    string id
    string invoice_id
    string description
    decimal quantity
    decimal unit_price
    decimal amount
  }

  activity_logs {
    string id
    string user_id
    string entity_type
    string entity_id
    string action
    json metadata
  }
```

## Auth And Authorization

The local trial build uses a seeded demo user, a scrypt-hashed password, server-created sessions, and an httpOnly SameSite=Lax cookie. Dashboard routes call `requireUser()` server-side before rendering. A production version should add email verification, password reset, rate limiting, and row-level ownership checks before multi-tenant launch.

## Key Decisions

- Keep the domain narrow so the app feels finished rather than oversized.
- Use a relational schema because invoices and clients have clear relationships.
- Keep session tokens hashed in the database and store the raw token only in an httpOnly cookie.
- Build the dashboard around payment collection health, not generic charts.
- Store activity logs immutably so reviewers can see auditability and real product thinking.
