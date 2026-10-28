"use client";

import { use, useState } from "react";
import { FiPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { CreateLabelDialog } from "@/features/labels/components/label-create-dialog";
import { LabelList } from "@/features/labels/components/label-list";

export default function LabelsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="cs-page">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Labels</h1>
          <p className="cs-page-description">
            Labels help you group and organize tasks across every project in
            this workspace.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <FiPlus aria-hidden="true" size={16} />
          New label
        </Button>
      </header>

      <LabelList
        onCreate={() => setCreateOpen(true)}
        workspaceId={workspaceId}
      />

      <CreateLabelDialog
        onClose={() => setCreateOpen(false)}
        open={createOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}