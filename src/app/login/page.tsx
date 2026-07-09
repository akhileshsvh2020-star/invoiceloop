import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { login } from "./actions";
import { SubmitButton } from "./submit-button";

export const metadata = {
  title: "Login - InvoiceLoop",
  description: "Sign in to the InvoiceLoop dashboard.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4 py-8 text-[var(--foreground)]">
      <section className="w-full max-w-md rounded-lg border border-[var(--line)] bg-white p-6 shadow-[0_18px_60px_rgba(38,31,20,0.08)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ink)] text-sm font-semibold text-white">
            IL
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to InvoiceLoop
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Use the demo account to review the app.
            </p>
          </div>
        </div>

        {params.error ? (
          <p className="mt-5 rounded-md border border-[#a64618]/30 bg-[#ffe8df] p-3 text-sm font-medium text-[#923a14]">
            The email or password is incorrect.
          </p>
        ) : null}

        <form action={login} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-semibold text-[var(--ink)]">
            Email
            <input
              className="field"
              defaultValue="demo@invoiceloop.app"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-[var(--ink)]">
            Password
            <input
              className="field"
              defaultValue="InvoiceLoop@2026"
              name="password"
              required
              type="password"
            />
          </label>
          <SubmitButton />
        </form>

        <p className="mt-5 rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 text-sm text-[var(--muted)]">
          Demo credentials: demo@invoiceloop.app / InvoiceLoop@2026
        </p>
      </section>
    </main>
  );
}
