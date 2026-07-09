const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const clients = [
  {
    id: "client-northstar",
    name: "Northstar Studio",
    contactEmail: "accounts@northstar.example",
    companyType: "Creative studio",
  },
  {
    id: "client-acme",
    name: "Acme Commerce",
    contactEmail: "finance@acme.example",
    companyType: "Retail operations",
  },
  {
    id: "client-brightdesk",
    name: "BrightDesk",
    contactEmail: "billing@brightdesk.example",
    companyType: "SaaS team",
  },
  {
    id: "client-mira",
    name: "Mira Health",
    contactEmail: "ops@mira.example",
    companyType: "Healthcare group",
  },
];

const invoices = [
  {
    id: "INV-1048",
    clientId: "client-northstar",
    title: "Brand landing page",
    status: "sent",
    amountCents: 320000,
    issuedAt: new Date("2026-07-02"),
    dueAt: new Date("2026-07-09"),
  },
  {
    id: "INV-1047",
    clientId: "client-acme",
    title: "Checkout audit",
    status: "overdue",
    amountCents: 185000,
    issuedAt: new Date("2026-06-22"),
    dueAt: new Date("2026-07-05"),
  },
  {
    id: "INV-1046",
    clientId: "client-brightdesk",
    title: "Monthly retainer",
    status: "paid",
    amountCents: 450000,
    issuedAt: new Date("2026-07-01"),
    dueAt: new Date("2026-07-08"),
    paidAt: new Date("2026-07-08"),
  },
  {
    id: "INV-1045",
    clientId: "client-mira",
    title: "Dashboard prototype",
    status: "draft",
    amountCents: 240000,
    issuedAt: new Date("2026-07-08"),
    dueAt: new Date("2026-07-14"),
  },
  {
    id: "INV-1044",
    clientId: "client-brightdesk",
    title: "June implementation sprint",
    status: "paid",
    amountCents: 920000,
    issuedAt: new Date("2026-06-16"),
    dueAt: new Date("2026-06-30"),
    paidAt: new Date("2026-06-28"),
  },
  {
    id: "INV-1043",
    clientId: "client-northstar",
    title: "Launch support package",
    status: "sent",
    amountCents: 660000,
    issuedAt: new Date("2026-06-28"),
    dueAt: new Date("2026-07-12"),
  },
];

async function main() {
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();

  for (const client of clients) {
    await prisma.client.create({ data: client });
  }

  for (const invoice of invoices) {
    await prisma.invoice.create({ data: invoice });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
