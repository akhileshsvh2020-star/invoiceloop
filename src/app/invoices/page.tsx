import { InvoiceWorkspace } from "./workspace";
import { getInvoiceWorkspaceData } from "@/lib/invoice-data";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "Invoices - InvoiceLoop",
  description: "Create, edit, filter, and export invoice records.",
};

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const data = await getInvoiceWorkspaceData();

  return (
    <InvoiceWorkspace
      clients={data.clients}
      currentUser={user}
      initialClientId={params.clientId}
      invoices={data.invoices}
    />
  );
}
