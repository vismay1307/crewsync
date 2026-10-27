"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiLogOut,
  FiMenu,
  FiSettings,
} from "react-icons/fi";

import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth-mutations";
import { useWorkspacesQuery } from "@/features/workspaces/hooks/use-workspace-queries";
import { cn } from "@/lib/api/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveWorkspaceId,
  setSidebarCollapsed,
} from "@/store/ui-slice";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const sidebarCollapsed = useAppSelector(
    (state) => state.ui.sidebarCollapsed,
  );

  const activeWorkspaceId = useAppSelector(
    (state) => state.ui.activeWorkspaceId,
  );

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const logoutMutation = useLogoutMutation();
  const workspacesQuery = useWorkspacesQuery();

  const [mobileNavPath, setMobileNavPath] = useState<string | null>(null);

  const mobileNavOpen =
    mobileNavPath !== null && mobileNavPath === pathname;

  const closeMobileNav = useCallback(() => {
    setMobileNavPath(null);
  }, []);

  const activeWorkspaceName = workspacesQuery.data?.find(
    (workspace) => workspace._id === activeWorkspaceId,
  )?.name;

  const fullName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ");

  const initials = [currentUser?.firstName, currentUser?.lastName]
    .map((part) => part?.charAt(0) ?? "")
    .join("")
    .toUpperCase();

  function handleWorkspaceChange(workspaceId: string) {
    dispatch(setActiveWorkspaceId(workspaceId || null));

    if (workspaceId) {
      router.push(`/workspaces/${workspaceId}`);
    }
  }

  function handleLogout() {
    logoutMutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:shadow-popover"
        href="#main-content"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-border bg-surface transition-[width] duration-200 md:flex",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-border",
            sidebarCollapsed ? "justify-center px-0" : "px-4",
          )}
        >
          <Brand hideName={sidebarCollapsed} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavLinks
            activeWorkspaceId={activeWorkspaceId}
            collapsed={sidebarCollapsed}
            workspaceName={activeWorkspaceName}
          />
        </div>

        {/* Collapse / expand */}
        <div className="shrink-0 border-t border-border p-3">
          <button
            aria-expanded={!sidebarCollapsed}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className={cn(
              "group relative flex h-10 w-full items-center rounded-lg text-sm text-muted transition-colors hover:bg-surface-highlight hover:text-foreground",
              sidebarCollapsed ? "justify-center px-0" : "gap-3 px-3",
            )}
            onClick={() =>
              dispatch(setSidebarCollapsed(!sidebarCollapsed))
            }
            type="button"
          >
            {sidebarCollapsed ? (
              <FiChevronsRight aria-hidden="true" size={16} />
            ) : (
              <FiChevronsLeft aria-hidden="true" size={16} />
            )}

            {sidebarCollapsed ? null : <span>Collapse</span>}

            {sidebarCollapsed ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-full z-30 ml-3 hidden whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground shadow-popover group-hover:block group-focus-visible:block"
              >
                Expand sidebar
              </span>
            ) : null}
          </button>
        </div>
      </aside>

      {/* Main application area */}
      <div
        className={cn(
          "transition-[padding] duration-200",
          sidebarCollapsed ? "md:pl-16" : "md:pl-64",
        )}
      >
        {/* Top navigation */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Button
              aria-expanded={mobileNavOpen}
              aria-haspopup="dialog"
              aria-label="Open navigation"
              className="md:hidden"
              onClick={() => setMobileNavPath(pathname)}
              size="icon"
              variant="ghost"
            >
              <FiMenu aria-hidden="true" size={18} />
            </Button>

            <div className="min-w-0 max-w-sm flex-1 md:w-64 md:flex-none">
              <Select
                aria-label="Select workspace"
                onChange={(event) =>
                  handleWorkspaceChange(event.target.value)
                }
                value={activeWorkspaceId ?? ""}
              >
                <option value="">Select workspace</option>

                {workspacesQuery.data?.map((workspace) => (
                  <option key={workspace._id} value={workspace._id}>
                    {workspace.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Desktop and tablet actions */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            {fullName ? (
              <div className="mr-1 flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground"
                >
                  {initials}
                </span>

                <span className="max-w-40 truncate text-sm font-medium text-foreground">
                  {fullName}
                </span>
              </div>
            ) : null}

            <ThemeToggle />

            <Button
              aria-label="Logout"
              disabled={logoutMutation.isPending}
              onClick={handleLogout}
              size="sm"
              variant="ghost"
            >
              <FiLogOut aria-hidden="true" size={16} />
              Logout
            </Button>
          </div>
        </header>

        {/* Consistent page container */}
        <main
          className="mx-auto w-full max-w-7xl px-4 py-6 focus:outline-none sm:px-6 sm:py-8 lg:px-8"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      {/* Mobile navigation drawer */}
      <MobileNav
        activeWorkspaceId={activeWorkspaceId}
        initials={initials}
        logoutPending={logoutMutation.isPending}
        onClose={closeMobileNav}
        onLogout={handleLogout}
        open={mobileNavOpen}
        userName={fullName}
        workspaceName={activeWorkspaceName}
      />
    </div>
  );
}

export function WorkspaceSettingsLink({
  workspaceId,
}: {
  workspaceId: string;
}) {
  return (
    <Link
      className="cs-link-button"
      href={`/workspaces/${workspaceId}/settings`}
    >
      <FiSettings size={15} />
      Settings
    </Link>
  );
}