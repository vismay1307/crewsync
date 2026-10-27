"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/features/workspaces/components/workspace-create-dialog";
import { WorkspaceList } from "@/features/workspaces/components/workspace-list";

export default function WorkspacesPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="cs-page">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Workspaces</h1>

          <p className="cs-page-description">
            Each workspace keeps its own projects, members, and labels. Open
            one to start working, or create a new one for another team.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <FiPlus aria-hidden="true" size={16} />
          New workspace
        </Button>
      </header>

      <WorkspaceList onCreate={() => setCreateOpen(true)} />

      <CreateWorkspaceDialog
        onClose={() => setCreateOpen(false)}
        open={createOpen}
      />
    </div>
  );
}