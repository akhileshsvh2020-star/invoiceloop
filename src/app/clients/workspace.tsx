"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatCurrency,
  type ClientSummaryRecord,
} from "@/lib/invoice-data";
import {
  createClient,
  deleteClient as deleteClientAction,
  updateClient,
} from "./actions";

type ClientDraft = {
  name: string;
  contactEmail: string;
  companyType: string;
};

const emptyDraft: ClientDraft = {
  name: "",
  contactEmail: "",
  companyType: "",
};

export function ClientWorkspace({
  clients,
}: {
  clients: ClientSummaryRecord[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<ClientDraft>(emptyDraft);

  const filteredClients = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return clients.filter((client) =>
      [client.name, client.contactEmail, client.companyType]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [clients, query]);

  const totals = useMemo(
    () => ({
      clients: clients.length,
      openInvoices: clients.reduce((sum, client) => sum + client.openCount, 0),
      billed: clients.reduce((sum, client) => sum + client.lifetimeBilled, 0),
    }),
    [clients],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      startTransition(async () => {
        await updateClient(editingId, draft);
        setEditingId(null);
        setDraft(emptyDraft);
        router.refresh();
      });
      return;
    }

    startTransition(async () => {
      await createClient(draft);
      setDraft(emptyDraft);
      router.refresh();
    });
  }

  function editClient(client: ClientSummaryRecord) {
    setEditingId(client.id);
    setDraft({
      name: client.name,
      contactEmail: client.contactEmail,
      companyType: client.companyType,
    });
  }

  function removeClient(clientId: string) {
    startTransition(async () => {
      await deleteClientAction(clientId);
      if (editingId === clientId) {
        setEditingId(null);
        setDraft(emptyDraft);
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
                Client operations
              </span>
            </span>
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] bg-white px-4 text-sm font-semibold"
              href="/"
            >
              Dashboard
            </Link>
            <Link
              className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] bg-white px-4 text-sm font-semibold"
              href="/invoices"
            >
              Invoices
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Clients" value={String(totals.clients)} />
          <StatCard label="Open invoices" value={String(totals.openInvoices)} warn />
          <StatCard label="Lifetime billed" value={formatCurrency(totals.billed)} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <form
            className="rounded-lg border border-[var(--line)] bg-white p-4"
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl font-semibold tracking-tight">
              {editingId ? "Edit client" : "Create client"}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Store billing contacts before creating invoice records.
            </p>

            <div className="mt-5 grid gap-4">
              <Field label="Client name">
                <input
                  className="field"
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  placeholder="Northstar Studio"
                  required
                  value={draft.name}
                />
              </Field>
              <Field label="Billing email">
                <input
                  className="field"
                  onChange={(event) =>
                    setDraft({ ...draft, contactEmail: event.target.value })
                  }
                  placeholder="accounts@example.com"
                  required
                  type="email"
                  value={draft.contactEmail}
                />
              </Field>
              <Field label="Company type">
                <input
                  className="field"
                  onChange={(event) =>
                    setDraft({ ...draft, companyType: event.target.value })
                  }
                  placeholder="Creative studio"
                  required
                  value={draft.companyType}
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="min-h-11 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white disabled:opacity-60"
                disabled={isPending}
              >
                {editingId ? "Save changes" : "Create client"}
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
                    setDraft(emptyDraft);
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
                  Client register
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Search contacts and review billing activity.
                </p>
              </div>
              <input
                className="field sm:max-w-80"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search clients"
                value={query}
              />
            </div>

            <div className="grid gap-3 p-4">
              {filteredClients.map((client) => (
                <article
                  className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4"
                  key={client.id}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{client.name}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {client.contactEmail}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                        {client.companyType}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-80">
                      <MiniStat label="Billed" value={formatCurrency(client.lifetimeBilled)} />
                      <MiniStat label="Invoices" value={String(client.invoiceCount)} />
                      <MiniStat label="Status" value={client.state} warn={client.overdueCount > 0} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold"
                      onClick={() => editClient(client)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md border border-[#a64618]/30 bg-white px-3 py-2 text-xs font-semibold text-[#923a14]"
                      onClick={() => removeClient(client.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredClients.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-semibold">No clients match this search.</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Clear the search or create a new billing contact.
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

function MiniStat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-md border border-[var(--line)] bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          warn ? "text-[var(--warning)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
