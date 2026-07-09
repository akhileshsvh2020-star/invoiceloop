import { InvoiceWorkspace } from "./workspace";
import { getInvoiceWorkspaceData } from "@/lib/invoice-data";

export const metadata = {
  title: "Invoices - InvoiceLoop",
  description: "Create, edit, filter, and export invoice records.",
};

export default async function InvoicesPage() {
  const data = await getInvoiceWorkspaceData();

  return <InvoiceWorkspace clients={data.clients} invoices={data.invoices} />;
}
