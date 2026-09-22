"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiBell,
  FiBriefcase,
  FiClock,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSend,
  FiSettings,
  FiTag,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth-mutations";
import { useWorkspacesQuery } from "@/features/workspaces/hooks/use-workspace-queries";
import { setActiveWorkspaceId, setSidebarCollapsed } from "@/store/ui-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const activeWorkspaceId = useAppSelector((state) => state.ui.activeWorkspaceId);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const logoutMutation = useLogoutMutation();
  const workspacesQuery = useWorkspacesQuery();
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: FiGrid },
    { href: "/workspaces", label: "Workspaces", icon: FiBriefcase },
    ...(activeWorkspaceId
      ? [
          {
            href: `/workspaces/${activeWorkspaceId}/projects`,
            label: "Projects",
            icon: FiBriefcase,
          },
          {
            href: `/workspaces/${activeWorkspaceId}/members`,
            label: "Members",
            icon: FiGrid,
          },
          {
            href: `/workspaces/${activeWorkspaceId}/labels`,
            label: "Labels",
            icon: FiTag,
          },
          {
            href: `/workspaces/${activeWorkspaceId}/invitations`,
            label: "Invitations",
            icon: FiSend,
          },
          {
            href: `/workspaces/${activeWorkspaceId}/activity`,
            label: "Activity",
            icon: FiClock,
          },
        ]
      : []),
    { href: "/notifications", label: "Notifications", icon: FiBell },
  ];

  function handleWorkspaceChange(workspaceId: string) {
    dispatch(setActiveWorkspaceId(workspaceId || null));
    if (workspaceId) {
      router.push(`/workspaces/${workspaceId}`);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-20 hidden border-r border-border bg-surface transition-[width] md:block ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!sidebarCollapsed ? (
            <Link className="flex items-center gap-3 text-sm font-semibold tracking-normal" href="/dashboard">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-primary/30 bg-primary/12 text-primary">
                C
              </span>
              <span className="text-base">CrewSync</span>
            </Link>
          ) : null}
          <button
            aria-label="Toggle sidebar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-highlight hover:text-foreground"
            onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
            type="button"
          >
            <FiMenu size={17} />
          </button>
        </div>
        <nav className="space-y-1.5 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={`relative flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-all ${
                  active
                    ? "bg-primary/12 text-foreground shadow-[inset_3px_0_0_var(--primary)]"
                    : "text-muted hover:bg-surface-highlight hover:text-foreground"
                }`}
                href={item.href}
                key={item.href}
              >
                <Icon className={active ? "text-primary" : ""} size={16} />
                {!sidebarCollapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className={sidebarCollapsed ? "md:pl-16" : "md:pl-64"}>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <Link className="text-sm font-semibold md:hidden" href="/dashboard">
              CrewSync
            </Link>
            <Select
              className="max-w-56"
              onChange={(event) => handleWorkspaceChange(event.target.value)}
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
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <Button
              aria-label="Logout"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              variant="ghost"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>
        <div className="px-5 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

export function WorkspaceSettingsLink({ workspaceId }: { workspaceId: string }) {
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
