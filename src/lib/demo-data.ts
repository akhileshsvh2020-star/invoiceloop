export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Client = {
  id: string;
  name: string;
  contactEmail: string;
  companyType: string;
  createdAt: string;
};

export type Invoice = {
  id: string;
  clientId: string;
  title: string;
  status: InvoiceStatus;
  amountCents: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
};

export const clients: Client[] = [
  {
    id: "client-northstar",
    name: "Northstar Studio",
    contactEmail: "accounts@northstar.example",
    companyType: "Creative studio",
    createdAt: "2026-05-02",
  },
  {
    id: "client-acme",
    name: "Acme Commerce",
    contactEmail: "finance@acme.example",
    companyType: "Retail operations",
    createdAt: "2026-05-19",
  },
  {
    id: "client-brightdesk",
    name: "BrightDesk",
    contactEmail: "billing@brightdesk.example",
    companyType: "SaaS team",
    createdAt: "2026-04-11",
  },
  {
    id: "client-mira",
    name: "Mira Health",
    contactEmail: "ops@mira.example",
    companyType: "Healthcare group",
    createdAt: "2026-06-08",
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-1048",
    clientId: "client-northstar",
    title: "Brand landing page",
    status: "sent",
    amountCents: 320000,
    issuedAt: "2026-07-02",
    dueAt: "2026-07-09",
  },
  {
    id: "INV-1047",
    clientId: "client-acme",
    title: "Checkout audit",
    status: "overdue",
    amountCents: 185000,
    issuedAt: "2026-06-22",
    dueAt: "2026-07-05",
  },
  {
    id: "INV-1046",
    clientId: "client-brightdesk",
    title: "Monthly retainer",
    status: "paid",
    amountCents: 450000,
    issuedAt: "2026-07-01",
    dueAt: "2026-07-08",
    paidAt: "2026-07-08",
  },
  {
    id: "INV-1045",
    clientId: "client-mira",
    title: "Dashboard prototype",
    status: "draft",
    amountCents: 240000,
    issuedAt: "2026-07-08",
    dueAt: "2026-07-14",
  },
  {
    id: "INV-1044",
    clientId: "client-brightdesk",
    title: "June implementation sprint",
    status: "paid",
    amountCents: 920000,
    issuedAt: "2026-06-16",
    dueAt: "2026-06-30",
    paidAt: "2026-06-28",
  },
  {
    id: "INV-1043",
    clientId: "client-northstar",
    title: "Launch support package",
    status: "sent",
    amountCents: 660000,
    issuedAt: "2026-06-28",
    dueAt: "2026-07-12",
  },
];

export function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

export function getClientName(clientId: string) {
  return clients.find((client) => client.id === clientId)?.name ?? "Unknown";
}

export function getDashboardMetrics() {
  const paid = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((total, invoice) => total + invoice.amountCents, 0);

  const outstanding = invoices
    .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
    .reduce((total, invoice) => total + invoice.amountCents, 0);

  const overdue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((total, invoice) => total + invoice.amountCents, 0);

  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const paidWithinDays =
    paidInvoices.reduce((total, invoice) => {
      if (!invoice.paidAt) {
        return total;
      }

      const issued = new Date(invoice.issuedAt).getTime();
      const paidDate = new Date(invoice.paidAt).getTime();
      return total + Math.round((paidDate - issued) / 86400000);
    }, 0) / paidInvoices.length;

  const paidRate = Math.round((paidInvoices.length / invoices.length) * 100);
  const sentRate = Math.round(
    (invoices.filter((invoice) => invoice.status === "sent").length /
      invoices.length) *
      100,
  );
  const overdueRate = Math.round(
    (invoices.filter((invoice) => invoice.status === "overdue").length /
      invoices.length) *
      100,
  );

  return {
    paid,
    outstanding,
    overdue,
    paidWithinDays,
    paidRate,
    sentRate,
    overdueRate,
  };
}

export function getClientSummaries() {
  return clients.map((client) => {
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
}
