"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

const invoiceSchema = z.object({
  id: z.string().trim().min(1).max(24),
  clientId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(120),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  amount: z.coerce.number().positive().max(1000000),
  dueAt: z.string().trim().min(1),
});

export type InvoicePayload = z.input<typeof invoiceSchema>;

export async function createInvoice(payload: InvoicePayload) {
  const data = invoiceSchema.parse(payload);

  await db.invoice.create({
    data: {
      id: data.id,
      clientId: data.clientId,
      title: data.title,
      status: data.status,
      amountCents: Math.round(data.amount * 100),
      issuedAt: new Date(),
      dueAt: new Date(data.dueAt),
      paidAt: data.status === "paid" ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/invoices");
}

export async function updateInvoice(invoiceId: string, payload: InvoicePayload) {
  const data = invoiceSchema.parse(payload);

  await db.invoice.update({
    where: { id: invoiceId },
    data: {
      clientId: data.clientId,
      title: data.title,
      status: data.status,
      amountCents: Math.round(data.amount * 100),
      dueAt: new Date(data.dueAt),
      paidAt: data.status === "paid" ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  await db.invoice.update({
    where: { id: invoiceId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/");
  revalidatePath("/invoices");
}
