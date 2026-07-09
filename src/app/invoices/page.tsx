import { InvoiceWorkspace } from "./workspace";
import { getInvoiceWorkspaceData } from "@/lib/invoice-data";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "Invoices - InvoiceLoop",
  description: "Create, edit, filter, and export invoice records.",
};

export default async function InvoicesPage() {
  const user = await requireUser();
  const data = await getInvoiceWorkspaceData();

  return (
    <InvoiceWorkspace
      clients={data.clients}
      currentUser={user}
      invoices={data.invoices}
    />
  );
}
