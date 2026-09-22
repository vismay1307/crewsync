import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4">
      <section className="cs-card p-6">
        <h1 className="cs-page-title">Page not found</h1>
        <p className="mt-2 text-sm text-muted">The requested CrewSync page does not exist.</p>
        <Link className="cs-link-button mt-4" href="/dashboard">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
