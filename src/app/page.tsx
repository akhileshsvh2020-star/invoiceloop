import {
  clients,
  formatCurrency,
  getClientName,
  getClientSummaries,
  getDashboardMetrics,
  invoices,
  type InvoiceStatus,
} from "@/lib/demo-data";

const statusStyles: Record<InvoiceStatus, string> = {
  sent: "border-[#c79334]/30 bg-[#fff5d8] text-[#7a5416]",
  overdue: "border-[#a64618]/25 bg-[#ffe8df] text-[#923a14]",
  paid: "border-[#176f62]/25 bg-[#def6ed] text-[#10564c]",
  draft: "border-stone-300 bg-stone-100 text-stone-700",
};

const statusLabels: Record<InvoiceStatus, string> = {
  sent: "Sent",
  overdue: "Overdue",
  paid: "Paid",
  draft: "Draft",
};

export default function Home() {
  const metrics = getDashboardMetrics();
  const clientSummaries = getClientSummaries();
  const latestInvoices = invoices.slice(0, 4);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <a className="flex items-center gap-3" href="#dashboard">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ink)] text-sm font-semibold text-white">
              IL
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">
                InvoiceLoop
              </span>
              <span className="block text-sm text-[var(--muted)]">
                Payment tracking for independent teams
              </span>
            </span>
          </a>
          <nav aria-label="Primary navigation" className="flex flex-wrap gap-2">
            {["Dashboard", "Invoices", "Clients", "Reports"].map((item) => (
              <a
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <button className="min-h-11 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
            New invoice
          </button>
        </header>

        <section
          id="dashboard"
          className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]"
        >
          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_18px_60px_rgba(38,31,20,0.08)] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                  July collection room
                </p>
                <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
                  Know what is paid, late, and ready to send.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
                  InvoiceLoop gives freelancers a calm command center for
                  clients, invoices, follow-ups, and cash flow.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-[var(--line)] bg-white p-3 sm:min-w-72">
                <Metric label="Collected" value={formatCurrency(metrics.paid)} />
                <Metric
                  label="Outstanding"
                  value={formatCurrency(metrics.outstanding)}
                />
                <Metric
                  label="Overdue"
                  value={formatCurrency(metrics.overdue)}
                  tone="warn"
                />
                <Metric
                  label="Avg. paid"
                  value={`${metrics.paidWithinDays.toFixed(1)}d`}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Next action", "Send reminder to Acme Commerce"],
                [
                  "Pipeline",
                  `${invoices.length} invoices across ${clients.length} clients`,
                ],
                ["Health", `${metrics.paidRate}% collection rate this month`],
              ].map(([label, value]) => (
                <div
                  className="rounded-md border border-[var(--line)] bg-white p-4"
                  key={label}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5 text-white shadow-[0_18px_60px_rgba(38,31,20,0.12)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Collection pulse</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                Live demo
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <Progress
                label="Paid"
                value={`${metrics.paidRate}%`}
                width={`${metrics.paidRate}%`}
              />
              <Progress
                label="Sent"
                value={`${metrics.sentRate}%`}
                width={`${metrics.sentRate}%`}
              />
              <Progress
                label="Overdue"
                value={`${metrics.overdueRate}%`}
                width={`${metrics.overdueRate}%`}
                warn
              />
            </div>
            <p className="mt-6 rounded-md border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/75">
              Demo account: demo@invoiceloop.app / demo1234. Production auth
              and row-level permissions are planned in the next milestone.
            </p>
          </aside>
        </section>

        <section
          id="invoices"
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="rounded-lg border border-[var(--line)] bg-white">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Invoices
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Search, filter, export, and reconcile invoice records.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  aria-label="Search invoices"
                  className="min-h-11 w-full rounded-md border border-[var(--line)] px-3 text-sm sm:w-52"
                  placeholder="Search invoices"
                />
                <button className="min-h-11 rounded-md border border-[var(--line)] px-3 text-sm font-semibold">
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                    <th className="px-4 py-3 font-semibold">Invoice</th>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Due</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestInvoices.map((invoice) => (
                    <tr className="border-b border-[var(--line)]" key={invoice.id}>
                      <td className="px-4 py-4">
                        <span className="block font-semibold text-[var(--ink)]">
                          {invoice.id}
                        </span>
                        <span className="text-[var(--muted)]">
                          {invoice.title}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {getClientName(invoice.clientId)}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {formatCurrency(invoice.amountCents)}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted)]">
                        {formatDueLabel(invoice)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[invoice.status]}`}
                        >
                          {statusLabels[invoice.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="clients" className="rounded-lg border border-[var(--line)] bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Clients</h2>
              <button className="min-h-11 rounded-md border border-[var(--line)] px-3 text-sm font-semibold">
                Add
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {clientSummaries.slice(0, 3).map((client) => (
                <div
                  className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4"
                  key={client.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[var(--ink)]">
                        {client.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {client.companyType}
                      </p>
                    </div>
                    <span className="text-right text-sm font-semibold">
                      {formatCurrency(client.lifetimeBilled)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                    {client.state}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function formatDueLabel(invoice: { status: InvoiceStatus; dueAt: string; paidAt?: string }) {
  if (invoice.status === "paid" && invoice.paidAt) {
    return `Paid ${formatShortDate(invoice.paidAt)}`;
  }

  if (invoice.status === "overdue") {
    return "Overdue";
  }

  return `Due ${formatShortDate(invoice.dueAt)}`;
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn";
}) {
  return (
    <div className="rounded-md bg-[var(--background)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-semibold tracking-tight ${
          tone === "warn" ? "text-[var(--warning)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Progress({
  label,
  value,
  width,
  warn,
}: {
  label: string;
  value: string;
  width: string;
  warn?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-white/75">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className={`h-2 rounded-full ${warn ? "bg-[#e07745]" : "bg-[#6fd0b8]"}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}
