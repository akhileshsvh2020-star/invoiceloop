import Link from "next/link";
import { logout } from "@/app/login/actions";
import { requireUser } from "@/lib/auth";
import {
  formatCurrency,
  getReportsData,
  type InvoiceStatus,
} from "@/lib/invoice-data";

const statusLabels: Record<InvoiceStatus, string> = {
  paid: "Paid",
  sent: "Sent",
  overdue: "Overdue",
  draft: "Draft",
};

export const metadata = {
  title: "Reports - InvoiceLoop",
  description: "Review invoice collection, payment status, and client revenue.",
};

export default async function ReportsPage() {
  const user = await requireUser();
  const { invoices, metrics, statusBreakdown, topClients } =
    await getReportsData();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ink)] text-sm font-semibold text-white">
              IL
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">
                InvoiceLoop
              </span>
              <span className="block text-sm text-[var(--muted)]">
                Reports
              </span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[var(--muted)]">
              {user.name}
            </span>
            <Link className="nav-button" href="/">
              Dashboard
            </Link>
            <Link className="nav-button" href="/invoices">
              Invoices
            </Link>
            <Link className="nav-button" href="/clients">
              Clients
            </Link>
            <form action={logout}>
              <button className="nav-button">Sign out</button>
            </form>
          </div>
        </header>

        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_18px_60px_rgba(38,31,20,0.08)]">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            Collection report
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)]">
            Revenue, open balance, and status health at a glance.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            This report is calculated from the current invoice database and
            updates when invoices or clients change.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportMetric label="Invoices" value={String(invoices.length)} />
          <ReportMetric label="Collected" value={formatCurrency(metrics.paid)} />
          <ReportMetric
            label="Outstanding"
            value={formatCurrency(metrics.outstanding)}
            warn
          />
          <ReportMetric
            label="Avg. paid"
            value={`${metrics.paidWithinDays.toFixed(1)}d`}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-lg border border-[var(--line)] bg-white p-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Status breakdown
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Count and value of invoices in each workflow state.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              {statusBreakdown.map((item) => (
                <div
                  className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4"
                  key={item.status}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--ink)]">
                        {statusLabels[item.status]}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {item.count} invoices · {item.share}% of total
                      </p>
                    </div>
                    <span className="text-lg font-semibold">
                      {formatCurrency(item.amountCents)}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div
                      className="h-2 rounded-full bg-[var(--accent)]"
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-white p-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Top clients
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Ranked by lifetime billed amount.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              {topClients.map((client, index) => (
                <article
                  className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4"
                  key={client.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                        Rank {index + 1}
                      </p>
                      <h3 className="mt-1 font-semibold text-[var(--ink)]">
                        {client.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {client.invoiceCount} invoices · {client.state}
                      </p>
                    </div>
                    <span className="text-right text-sm font-semibold">
                      {formatCurrency(client.lifetimeBilled)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ReportMetric({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-semibold tracking-tight ${
          warn ? "text-[var(--warning)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
