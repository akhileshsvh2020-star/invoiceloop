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

Production auth should be handled by Supabase Auth or Auth.js instead of hand-rolled crypto. Dashboard routes are protected server-side, and every mutation checks that the current user owns the target row before writing.

## Key Decisions

- Keep the domain narrow so the app feels finished rather than oversized.
- Use a relational schema because invoices and clients have clear relationships.
- Build the dashboard around payment collection health, not generic charts.
- Store activity logs immutably so reviewers can see auditability and real product thinking.
