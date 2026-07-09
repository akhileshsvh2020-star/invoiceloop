import { getClientWorkspaceData } from "@/lib/invoice-data";
import { ClientWorkspace } from "./workspace";

export const metadata = {
  title: "Clients - InvoiceLoop",
  description: "Create, edit, search, and review billing clients.",
};

export default async function ClientsPage() {
  const clients = await getClientWorkspaceData();

  return <ClientWorkspace clients={clients} />;
}
