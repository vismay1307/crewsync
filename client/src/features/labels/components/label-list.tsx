"use client";

import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useDeleteLabelMutation,
  useLabelsQuery,
} from "@/features/labels/hooks/use-label-queries";

export function LabelList({ workspaceId }: { workspaceId: string }) {
  const labelsQuery = useLabelsQuery(workspaceId, {
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  const deleteMutation = useDeleteLabelMutation(workspaceId);

  if (labelsQuery.isPending) {
    return <p className="text-sm text-muted">Loading labels</p>;
  }

  if (labelsQuery.isError) {
    return <p className="text-sm text-destructive">{labelsQuery.error.message}</p>;
  }

  if (!labelsQuery.data.items.length) {
    return (
      <Card className="p-5" variant="empty">
        <h2 className="cs-section-title">No labels yet</h2>
        <p className="mt-1 text-sm leading-6 text-muted">Create labels for workspace task grouping.</p>
      </Card>
    );
  }

  return (
    <Card variant="list">
      {labelsQuery.data.items.map((label) => (
        <div className="cs-row flex items-center justify-between gap-4 p-4 transition-colors" key={label._id}>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border border-border-strong"
                style={{ backgroundColor: label.color }}
              />
              <h2 className="truncate text-sm font-semibold text-foreground">{label.name}</h2>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {label.description || label.color}
            </p>
          </div>
          <Button
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(label._id)}
            variant="ghost"
          >
            <FiTrash2 size={15} />
          </Button>
        </div>
      ))}
    </Card>
  );
}
