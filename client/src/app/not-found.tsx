import Link from "next/link";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <section className="w-full max-w-md text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="cs-page-title mt-2">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}