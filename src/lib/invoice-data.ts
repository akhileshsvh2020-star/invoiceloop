import { db } from "@/lib/db";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type ClientRecord = {
  id: string;
  name: string;
  contactEmail: string;
  companyType: string;
  createdAt: string;
};

export type InvoiceRecord = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  status: InvoiceStatus;
  amountCents: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
};

export function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

export async function getInvoiceWorkspaceData() {
  const [clients, invoices] = await Promise.all([
    db.client.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    }),
    db.invoice.findMany({
      where: { deletedAt: null },
      include: { client: true },
      orderBy: { dueAt: "desc" },
    }),
  ]);

  return {
    clients: clients.map((client): ClientRecord => ({
      id: client.id,
      name: client.name,
      contactEmail: client.contactEmail,
      companyType: client.companyType,
      createdAt: client.createdAt.toISOString(),
    })),
    invoices: invoices.map((invoice): InvoiceRecord => ({
      id: invoice.id,
      clientId: invoice.clientId,
      clientName: invoice.client.name,
      title: invoice.title,
      status: invoice.status as InvoiceStatus,
      amountCents: invoice.amountCents,
      issuedAt: invoice.issuedAt.toISOString(),
      dueAt: invoice.dueAt.toISOString(),
      paidAt: invoice.paidAt?.toISOString(),
    })),
  };
}

export async function getDashboardData() {
  const { clients, invoices } = await getInvoiceWorkspaceData();
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");

  const paid = paidInvoices.reduce(
    (total, invoice) => total + invoice.amountCents,
    0,
  );
  const outstanding = invoices
    .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
    .reduce((total, invoice) => total + invoice.amountCents, 0);
  const overdue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((total, invoice) => total + invoice.amountCents, 0);

  const paidWithinDays =
    paidInvoices.length > 0
      ? paidInvoices.reduce((total, invoice) => {
          if (!invoice.paidAt) {
            return total;
          }

          const issued = new Date(invoice.issuedAt).getTime();
          const paidDate = new Date(invoice.paidAt).getTime();
          return total + Math.round((paidDate - issued) / 86400000);
        }, 0) / paidInvoices.length
      : 0;

  const paidRate =
    invoices.length > 0 ? Math.round((paidInvoices.length / invoices.length) * 100) : 0;
  const sentRate =
    invoices.length > 0
      ? Math.round(
          (invoices.filter((invoice) => invoice.status === "sent").length /
            invoices.length) *
            100,
        )
      : 0;
  const overdueRate =
    invoices.length > 0
      ? Math.round(
          (invoices.filter((invoice) => invoice.status === "overdue").length /
            invoices.length) *
            100,
        )
      : 0;

  const clientSummaries = clients.map((client) => {
    const clientInvoices = invoices.filter(
      (invoice) => invoice.clientId === client.id,
    );
    const lifetimeBilled = clientInvoices.reduce(
      (total, invoice) => total + invoice.amountCents,
      0,
    );
    const overdueCount = clientInvoices.filter(
      (invoice) => invoice.status === "overdue",
    ).length;
    const openCount = clientInvoices.filter(
      (invoice) => invoice.status === "sent" || invoice.status === "overdue",
    ).length;

    return {
      ...client,
      lifetimeBilled,
      state:
        overdueCount > 0
          ? `${overdueCount} overdue`
          : openCount > 0
            ? `${openCount} open`
            : "clear",
    };
  });

  return {
    clients,
    invoices,
    clientSummaries,
    metrics: {
      paid,
      outstanding,
      overdue,
      paidWithinDays,
      paidRate,
      sentRate,
      overdueRate,
    },
  };
}
