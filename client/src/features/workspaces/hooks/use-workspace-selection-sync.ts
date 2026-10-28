"use client";

import { useEffect } from "react";

import type { Workspace } from "@/types/entities";
import { useAppDispatch } from "@/store/hooks";
import { setActiveWorkspaceId } from "@/store/ui-slice";

type WorkspaceSelectionSyncOptions = {
  pathname: string;
  activeWorkspaceId: string | null;
  workspaces: Workspace[] | undefined;
  workspacesLoaded: boolean;
  workspacesFetching: boolean;
};

function getWorkspaceIdFromPathname(
  pathname: string,
): string | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "workspaces" || !segments[1]) {
    return null;
  }

  return segments[1];
}

export function useWorkspaceSelectionSync({
  pathname,
  activeWorkspaceId,
  workspaces,
  workspacesLoaded,
  workspacesFetching,
}: WorkspaceSelectionSyncOptions) {
  const dispatch = useAppDispatch();

  const routeWorkspaceId = getWorkspaceIdFromPathname(pathname);

  // Sync Redux with the workspace represented by the URL.
  // Leaving a workspace route clears the selection.
  // Manually clearing the dropdown does not change pathname,
  // so the selection will not be immediately restored.
  useEffect(() => {
    dispatch(setActiveWorkspaceId(routeWorkspaceId));
  }, [dispatch, routeWorkspaceId]);

  // Remove deleted workspace selections only after the list is stable.
  // On workspace routes, keep the URL's workspace ID so its page can
  // report a missing or inaccessible workspace.
  useEffect(() => {
    if (
      routeWorkspaceId ||
      !activeWorkspaceId ||
      !workspacesLoaded ||
      workspacesFetching ||
      !workspaces
    ) {
      return;
    }

    const workspaceExists = workspaces.some(
      (workspace) => workspace._id === activeWorkspaceId,
    );

    if (!workspaceExists) {
      dispatch(setActiveWorkspaceId(null));
    }
  }, [
    activeWorkspaceId,
    dispatch,
    routeWorkspaceId,
    workspaces,
    workspacesFetching,
    workspacesLoaded,
  ]);
}