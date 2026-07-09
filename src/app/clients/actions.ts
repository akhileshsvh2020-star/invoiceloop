"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

const clientSchema = z.object({
  name: z.string().trim().min(2).max(80),
  contactEmail: z.string().trim().email().max(120),
  companyType: z.string().trim().min(2).max(80),
});

export type ClientPayload = z.input<typeof clientSchema>;

export async function createClient(payload: ClientPayload) {
  const data = clientSchema.parse(payload);

  await db.client.create({ data });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/invoices");
}

export async function updateClient(clientId: string, payload: ClientPayload) {
  const data = clientSchema.parse(payload);

  await db.client.update({
    where: { id: clientId },
    data,
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/invoices");
}

export async function deleteClient(clientId: string) {
  const deletedAt = new Date();

  await db.$transaction([
    db.invoice.updateMany({
      where: { clientId, deletedAt: null },
      data: { deletedAt },
    }),
    db.client.update({
      where: { id: clientId },
      data: { deletedAt },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/invoices");
}
