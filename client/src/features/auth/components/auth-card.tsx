import { FiCheck } from "react-icons/fi";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/api/cn";

export type AuthPanelContent = {
  description: string;
  heading: string;
  points: string[];
};

function AuthBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        C
      </span>

      <span className="text-base font-semibold tracking-tight text-foreground">
        CrewSync
      </span>
    </div>
  );
}

export function AuthAlert({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm leading-5 text-destructive"
      role="alert"
    >
      {children}
    </p>
  );
}

export function AuthCard({
  children,
  panel,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  panel?: AuthPanelContent;
  subtitle: string;
  title: string;
}) {
  return (
    <main
      className={cn(
        "min-h-screen bg-background",
        panel && "lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]",
      )}
    >
      {panel ? (
        <div className="hidden flex-col border-r border-border bg-surface p-12 lg:flex xl:p-16">
          <AuthBrand />

          <div className="my-auto max-w-md py-12">
            <p className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
              {panel.heading}
            </p>

            <p className="mt-4 text-base leading-7 text-muted">
              {panel.description}
            </p>

            <ul className="mt-8 space-y-3">
              {panel.points.map((point) => (
                <li
                  className="flex items-start gap-3 text-sm leading-6 text-foreground"
                  key={point}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground"
                  >
                    <FiCheck size={12} />
                  </span>

                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          <div className={cn("mb-8", panel && "lg:hidden")}>
            <AuthBrand />
          </div>

          <section className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                {subtitle}
              </p>
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}