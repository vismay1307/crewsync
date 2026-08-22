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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted">CrewSync</p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
