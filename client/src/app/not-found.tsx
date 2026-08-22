import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4">
      <section className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">The requested CrewSync page does not exist.</p>
        <Link
          className="mt-4 inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-background"
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
