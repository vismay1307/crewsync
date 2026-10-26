import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AuthCard({
  children,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <section className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted">CrewSync</p>

          <h1 className="mt-2 text-2xl font-bold text-foreground">
            {title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            {subtitle}
          </p>
        </div>

        {children}
      </section>
    </main>
  );
}