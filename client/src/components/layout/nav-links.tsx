"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getActiveNavKey,
  getWorkspaceNavItems,
  PRIMARY_NAV_ITEMS,
  type NavItem,
  type NavKey,
} from "@/components/layout/nav-config";
import { cn } from "@/lib/api/cn";

type NavLinksProps = {
  activeWorkspaceId: string | null;
  collapsed?: boolean;
  onNavigate?: () => void;
  workspaceName?: string;
};

export function NavLinks({
  activeWorkspaceId,
  collapsed = false,
  onNavigate,
  workspaceName,
}: NavLinksProps) {
  const pathname = usePathname();
  const activeKey = getActiveNavKey(pathname);

  const workspaceItems = activeWorkspaceId
    ? getWorkspaceNavItems(activeWorkspaceId)
    : [];

  return (
    <nav aria-label="Main" className="flex flex-col gap-5 p-3">
      <NavGroup
        activeKey={activeKey}
        collapsed={collapsed}
        items={PRIMARY_NAV_ITEMS}
        onNavigate={onNavigate}
      />

      {workspaceItems.length > 0 ? (
        <NavGroup
          activeKey={activeKey}
          collapsed={collapsed}
          items={workspaceItems}
          label={workspaceName ?? "Workspace"}
          onNavigate={onNavigate}
        />
      ) : null}
    </nav>
  );
}

function NavGroup({
  activeKey,
  collapsed,
  items,
  label,
  onNavigate,
}: {
  activeKey: NavKey | null;
  collapsed: boolean;
  items: NavItem[];
  label?: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      {label ? (
        collapsed ? (
          <div
            aria-hidden="true"
            className="mx-3 mb-2 h-px bg-border"
          />
        ) : (
          <p className="mb-1.5 truncate px-3 text-xs font-medium text-muted">
            {label}
          </p>
        )
      ) : null}

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.key}>
            <NavLink
              active={item.key === activeKey}
              collapsed={collapsed}
              item={item}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavLink({
  active,
  collapsed,
  item,
  onNavigate,
}: {
  active: boolean;
  collapsed: boolean;
  item: NavItem;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-10 items-center rounded-lg text-sm transition-colors",
        collapsed ? "justify-center px-0" : "gap-3 px-3",
        active
          ? "bg-primary-soft font-medium text-primary-soft-foreground"
          : "text-muted hover:bg-surface-highlight hover:text-foreground",
      )}
      href={item.href}
      onClick={onNavigate}
    >
      <Icon aria-hidden="true" className="shrink-0" size={16} />

      <span className={collapsed ? "sr-only" : "truncate"}>
        {item.label}
      </span>

      {collapsed ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-full z-30 ml-3 hidden whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground shadow-popover group-hover:block group-focus-visible:block"
        >
          {item.label}
        </span>
      ) : null}
    </Link>
  );
}