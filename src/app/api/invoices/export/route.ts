import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const status = searchParams.get("status") ?? "all";

  const invoices = await db.invoice.findMany({
    where: {
      deletedAt: null,
      ...(status !== "all" ? { status } : {}),
    },
    include: { client: true },
    orderBy: { dueAt: "desc" },
  });

  const filteredInvoices = query
    ? invoices.filter((invoice) =>
        [invoice.id, invoice.title, invoice.client.name]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : invoices;

  const rows = [
    [
      "Invoice",
      "Client",
      "Title",
      "Status",
      "Amount",
      "Issued At",
      "Due At",
      "Paid At",
    ],
    ...filteredInvoices.map((invoice) => [
      invoice.id,
      invoice.client.name,
      invoice.title,
      invoice.status,
      (invoice.amountCents / 100).toFixed(2),
      formatDate(invoice.issuedAt),
      formatDate(invoice.dueAt),
      invoice.paidAt ? formatDate(invoice.paidAt) : "",
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Disposition": 'attachment; filename="invoiceloop-invoices.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}
