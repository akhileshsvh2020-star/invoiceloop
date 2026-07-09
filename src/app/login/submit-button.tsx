"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      className="min-h-11 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-75"
      disabled={pending}
      type="submit"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}
