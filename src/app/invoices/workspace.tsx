"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatCurrency,
  type ClientRecord,
  type InvoiceRecord,
  type InvoiceStatus,
} from "@/lib/invoice-data";
import {
  createInvoice,
  deleteInvoice as deleteInvoiceAction,
  updateInvoice,
} from "./actions";
import { logout } from "@/app/login/actions";

const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

const statusLabels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};

const statusStyles: Record<InvoiceStatus, string> = {
  draft: "border-stone-300 bg-stone-100 text-stone-700",
  sent: "border-[#c79334]/30 bg-[#fff5d8] text-[#7a5416]",
  paid: "border-[#176f62]/25 bg-[#def6ed] text-[#10564c]",
  overdue: "border-[#a64618]/25 bg-[#ffe8df] text-[#923a14]",
};

type InvoiceDraft = {
  id: string;
  clientId: string;
  title: string;
  status: InvoiceStatus;
  amount: string;
  dueAt: string;
};

const emptyDraft: InvoiceDraft = {
  id: "",
  clientId: "",
  title: "",
  status: "draft",
  amount: "",
  dueAt: "2026-07-31",
};

export function InvoiceWorkspace({
  clients,
  currentUser,
  invoices,
}: {
  clients: ClientRecord[];
  currentUser: { name: string; email: string };
  invoices: InvoiceRecord[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<InvoiceDraft>({
    ...emptyDraft,
    clientId: clients[0]?.id ?? "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");

  const filteredInvoices = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return invoices
      .filter((invoice) => status === "all" || invoice.status === status)
      .filter((invoice) => {
        return (
          invoice.id.toLowerCase().includes(needle) ||
          invoice.title.toLowerCase().includes(needle) ||
          invoice.clientName.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => b.dueAt.localeCompare(a.dueAt));
  }, [invoices, query, status]);

  const totals = useMemo(() => {
    const paid = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.amountCents, 0);
    const open = invoices
      .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.amountCents, 0);
    return { paid, open, count: invoices.length };
  }, [invoices]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountCents = Math.round(Number(draft.amount) * 100);
    if (!draft.title.trim() || Number.isNaN(amountCents) || amountCents <= 0) {
      return;
    }

    if (editingId) {
      startTransition(async () => {
        await updateInvoice(editingId, {
          ...draft,
          amount: draft.amount,
          id: editingId,
        });
        setEditingId(null);
        setDraft({ ...emptyDraft, clientId: clients[0]?.id ?? "" });
        router.refresh();
      });
    } else {
      startTransition(async () => {
        await createInvoice({
          ...draft,
          amount: draft.amount,
          id: draft.id.trim() || `INV-${1050 + invoices.length}`,
        });
        setDraft({ ...emptyDraft, clientId: clients[0]?.id ?? "" });
        router.refresh();
      });
    }
  }

  function editInvoice(invoice: InvoiceRecord) {
    setEditingId(invoice.id);
    setDraft({
      id: invoice.id,
      clientId: invoice.clientId,
      title: invoice.title,
      status: invoice.status,
      amount: String(invoice.amountCents / 100),
      dueAt: invoice.dueAt,
    });
  }

  function removeInvoice(invoiceId: string) {
    startTransition(async () => {
      await deleteInvoiceAction(invoiceId);
      if (editingId === invoiceId) {
        setEditingId(null);
        setDraft({ ...emptyDraft, clientId: clients[0]?.id ?? "" });
      }
      router.refresh();
    });
  }

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
                Invoice operations
              </span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[var(--muted)]">
              {currentUser.name}
            </span>
            <Link
              className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] bg-white px-4 text-sm font-semibold"
              href="/"
            >
              Dashboard
            </Link>
            <form action={logout}>
              <button className="min-h-11 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-semibold">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Invoices" value={String(totals.count)} />
          <StatCard label="Collected" value={formatCurrency(totals.paid)} />
          <StatCard label="Open balance" value={formatCurrency(totals.open)} warn />
        </section>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <form
            className="rounded-lg border border-[var(--line)] bg-white p-4"
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl font-semibold tracking-tight">
              {editingId ? "Edit invoice" : "Create invoice"}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Add a client invoice and track its collection status.
            </p>

            <div className="mt-5 grid gap-4">
              <Field label="Invoice number">
                <input
                  className="field"
                  disabled={Boolean(editingId)}
                  onChange={(event) =>
                    setDraft({ ...draft, id: event.target.value })
                  }
                  placeholder="INV-1050"
                  value={draft.id}
                />
              </Field>

              <Field label="Client">
                <select
                  className="field"
                  onChange={(event) =>
                    setDraft({ ...draft, clientId: event.target.value })
                  }
                  value={draft.clientId}
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Work title">
                <input
                  className="field"
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  placeholder="Website implementation"
                  required
                  value={draft.title}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Amount">
                  <input
                    className="field"
                    min="1"
                    onChange={(event) =>
                      setDraft({ ...draft, amount: event.target.value })
                    }
                    placeholder="2500"
                    required
                    type="number"
                    value={draft.amount}
                  />
                </Field>
                <Field label="Due date">
                  <input
                    className="field"
                    onChange={(event) =>
                      setDraft({ ...draft, dueAt: event.target.value })
                    }
                    required
                    type="date"
                    value={draft.dueAt}
                  />
                </Field>
              </div>

              <Field label="Status">
                <select
                  className="field"
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      status: event.target.value as InvoiceStatus,
                    })
                  }
                  value={draft.status}
                >
                  {statuses.map((invoiceStatus) => (
                    <option key={invoiceStatus} value={invoiceStatus}>
                      {statusLabels[invoiceStatus]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button className="min-h-11 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white">
                {editingId ? "Save changes" : "Create invoice"}
              </button>
              {isPending ? (
                <span className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)]">
                  Saving...
                </span>
              ) : null}
              {editingId ? (
                <button
                  className="min-h-11 rounded-md border border-[var(--line)] px-4 text-sm font-semibold"
                  onClick={() => {
                    setEditingId(null);
                    setDraft({ ...emptyDraft, clientId: clients[0]?.id ?? "" });
                  }}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="rounded-lg border border-[var(--line)] bg-white">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] p-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Invoice register
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Filter by status, search by invoice, client, or work title.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="field sm:w-64"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search invoices"
                  value={query}
                />
                <select
                  className="field sm:w-40"
                  onChange={(event) =>
                    setStatus(event.target.value as InvoiceStatus | "all")
                  }
                  value={status}
                >
                  <option value="all">All statuses</option>
                  {statuses.map((invoiceStatus) => (
                    <option key={invoiceStatus} value={invoiceStatus}>
                      {statusLabels[invoiceStatus]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                    <th className="px-4 py-3 font-semibold">Invoice</th>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Due</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr className="border-b border-[var(--line)]" key={invoice.id}>
                      <td className="px-4 py-4">
                        <span className="block font-semibold">{invoice.id}</span>
                        <span className="text-[var(--muted)]">
                          {invoice.title}
                        </span>
                      </td>
                      <td className="px-4 py-4">{invoice.clientName}</td>
                      <td className="px-4 py-4 font-semibold">
                        {formatCurrency(invoice.amountCents)}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted)]">
                        {formatDate(invoice.dueAt)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[invoice.status]}`}
                        >
                          {statusLabels[invoice.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            className="rounded-md border border-[var(--line)] px-3 py-2 text-xs font-semibold"
                            onClick={() => editInvoice(invoice)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md border border-[#a64618]/30 px-3 py-2 text-xs font-semibold text-[#923a14]"
                            onClick={() => removeInvoice(invoice.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-semibold">No invoices match this view.</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Clear the search or switch back to all statuses.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-[var(--ink)]">
      {label}
      {children}
    </label>
  );
}

function StatCard({
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
