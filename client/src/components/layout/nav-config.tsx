import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBell,
  FiFolder,
  FiGrid,
  FiLayers,
  FiMail,
  FiTag,
  FiUsers,
} from "react-icons/fi";

export type WorkspaceSection =
  | "projects"
  | "members"
  | "labels"
  | "invitations"
  | "activity";

export type NavKey =
  | "dashboard"
  | "workspaces"
  | "notifications"
  | WorkspaceSection;

export type NavItem = {
  href: string;
  icon: IconType;
  key: NavKey;
  label: string;
};

const WORKSPACE_SECTIONS: readonly string[] = [
  "projects",
  "members",
  "labels",
  "invitations",
  "activity",
];

function isWorkspaceSection(
  value: string | undefined,
): value is WorkspaceSection {
  return value !== undefined && WORKSPACE_SECTIONS.includes(value);
}

export function getActiveNavKey(pathname: string): NavKey | null {
  const [root, , section] = pathname.split("/").filter(Boolean);

  if (root === "dashboard") return "dashboard";
  if (root === "notifications") return "notifications";

  if (root === "workspaces") {
    return isWorkspaceSection(section) ? section : "workspaces";
  }

  return null;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    icon: FiGrid,
    key: "dashboard",
    label: "Dashboard",
  },
  {
    href: "/workspaces",
    icon: FiLayers,
    key: "workspaces",
    label: "Workspaces",
  },
  {
    href: "/notifications",
    icon: FiBell,
    key: "notifications",
    label: "Notifications",
  },
];

export function getWorkspaceNavItems(workspaceId: string): NavItem[] {
  const base = `/workspaces/${workspaceId}`;

  return [
    {
      href: `${base}/projects`,
      icon: FiFolder,
      key: "projects",
      label: "Projects",
    },
    {
      href: `${base}/members`,
      icon: FiUsers,
      key: "members",
      label: "Members",
    },
    {
      href: `${base}/labels`,
      icon: FiTag,
      key: "labels",
      label: "Labels",
    },
    {
      href: `${base}/invitations`,
      icon: FiMail,
      key: "invitations",
      label: "Invitations",
    },
    {
      href: `${base}/activity`,
      icon: FiActivity,
      key: "activity",
      label: "Activity",
    },
  ];
}