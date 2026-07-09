import { InvoiceWorkspace } from "./workspace";

export const metadata = {
  title: "Invoices - InvoiceLoop",
  description: "Create, edit, filter, and export invoice records.",
};

export default function InvoicesPage() {
  return <InvoiceWorkspace />;
}
