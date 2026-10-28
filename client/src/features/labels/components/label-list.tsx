"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  LabelRowSkeleton,
  LabelSwatch,
} from "@/features/labels/components/label-parts";
import {
  useDeleteLabelMutation,
  useLabelsQuery,
} from "@/features/labels/hooks/use-label-queries";

export function LabelList({
  onCreate,
  workspaceId,
}: {
  onCreate?: () => void;
  workspaceId: string;
}) {
  const labelsQuery = useLabelsQuery(workspaceId, {
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  const deleteMutation = useDeleteLabelMutation(workspaceId);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function cancelDelete() {
    setConfirmingId(null);
    deleteMutation.reset();
  }

  function confirmDelete(labelId: string) {
    deleteMutation.mutate(labelId, {
      onSuccess: () => setConfirmingId(null),
    });
  }

  if (labelsQuery.isPending) {
    return (
      <Card aria-busy="true" variant="list">
        {[0, 1, 2].map((index) => (
          <LabelRowSkeleton key={index} />
        ))}
        <span className="sr-only" role="status">
          Loading labels
        </span>
      </Card>
    );
  }

  if (labelsQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={labelsQuery.isFetching}
            onClick={() => void labelsQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {labelsQuery.error.message}
      </ErrorAlert>
    );
  }

  if (!labelsQuery.data.items.length) {
    return (
      <Card className="p-6" variant="empty">
        <p className="cs-section-title">No labels yet</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Create labels to group and organize tasks across this workspace.
        </p>
        {onCreate ? (
          <Button className="mt-4" onClick={onCreate}>
            Create label
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {deleteMutation.isError ? (
        <ErrorAlert>
          Could not delete the label. {deleteMutation.error.message}
        </ErrorAlert>
      ) : null}

      <Card variant="list">
        <ul>
          {labelsQuery.data.items.map((label) => {
            const confirming = confirmingId === label._id;
            const deleting =
              deleteMutation.isPending && deleteMutation.variables === label._id;

            return (
              <li
                className="cs-row flex flex-wrap items-center gap-x-4 gap-y-3 p-4"
                key={label._id}
              >
                <LabelSwatch color={label.color} />

                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-medium text-foreground">
                    {label.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                    {label.description || "No description"}
                  </p>
                </div>

                <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">
                  {label.color}
                </span>

                <div
                  className="flex shrink-0 items-center gap-2"
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && confirming && !deleting) {
                      cancelDelete();
                    }
                  }}
                >
                  {confirming ? (
                    <>
                      <span className="hidden text-sm text-muted sm:inline">
                        Delete this label?
                      </span>
                      <Button
                        disabled={deleting}
                        onClick={cancelDelete}
                        size="sm"
                        variant="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        aria-label={`Confirm delete ${label.name}`}
                        loading={deleting}
                        onClick={() => confirmDelete(label._id)}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button
                      aria-label={`Delete ${label.name}`}
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        deleteMutation.reset();
                        setConfirmingId(label._id);
                      }}
                      size="icon"
                      title="Delete"
                      variant="ghost"
                    >
                      <FiTrash2 aria-hidden="true" size={15} />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}