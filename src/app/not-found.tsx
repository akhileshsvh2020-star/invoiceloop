import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4 py-8 text-[var(--foreground)]">
      <section className="w-full max-w-xl rounded-lg border border-[var(--line)] bg-white p-6 shadow-[0_18px_60px_rgba(38,31,20,0.08)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ink)] text-sm font-semibold text-white">
            IL
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            404
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          This invoice trail ends here.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
          The page you opened does not exist or has moved. Return to the
          dashboard to continue managing clients and invoices.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            className="inline-flex min-h-11 items-center rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white"
            href="/"
          >
            Dashboard
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] px-4 text-sm font-semibold"
            href="/invoices"
          >
            Invoices
          </Link>
        </div>
      </section>
    </main>
  );
}
