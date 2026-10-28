"use client";

import { type FormEvent, useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/features/comments/hooks/use-comment-queries";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/types/entities";

function userName(user: string | User) {
  if (typeof user === "string") return "User";
  return `${user.firstName} ${user.lastName}`;
}

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U"
  );
}

function formatCommentTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function CommentThread({
  projectId,
  taskId,
  workspaceId,
}: {
  projectId: string;
  taskId: string;
  workspaceId: string;
}) {
  const [body, setBody] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const commentsQuery = useCommentsQuery(workspaceId, projectId, taskId, { limit: 50 });
  const createMutation = useCreateCommentMutation(workspaceId, projectId, taskId);
  const deleteMutation = useDeleteCommentMutation(workspaceId, projectId, taskId);
  const canSubmit = body.trim().length > 0 && body.trim().length <= 5000 && !createMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    createMutation.mutate(
      { body },
      {
        onSuccess: () => setBody(""),
      }
    );
  }

  function cancelDelete() {
    setConfirmingId(null);
    deleteMutation.reset();
  }

  function confirmDelete(commentId: string) {
    deleteMutation.mutate(commentId, {
      onSuccess: () => setConfirmingId(null),
    });
  }

  const apiError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error?.message;

  return (
    <Card className="p-5">
      <h2 className="cs-section-title">Comments</h2>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <Textarea
          aria-label="Add a comment"
          className="min-h-24"
          maxLength={5000}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add a comment"
          value={body}
        />
        {apiError ? <ErrorAlert>{apiError}</ErrorAlert> : null}
        <div className="flex justify-end">
          <Button
            disabled={!canSubmit}
            loading={createMutation.isPending}
            type="submit"
          >
            {createMutation.isPending ? "Posting" : "Post comment"}
          </Button>
        </div>
      </form>

      <div className="mt-6 space-y-4 border-t border-border pt-5">
        {commentsQuery.isPending ? (
          <div aria-busy="true" className="space-y-4">
            {[0, 1].map((index) => (
              <div className="flex gap-3" key={index}>
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
            <span className="sr-only" role="status">
              Loading comments
            </span>
          </div>
        ) : null}

        {commentsQuery.isError ? (
          <ErrorAlert
            action={
              <Button
                loading={commentsQuery.isFetching}
                onClick={() => void commentsQuery.refetch()}
                size="sm"
                variant="secondary"
              >
                Try again
              </Button>
            }
          >
            {commentsQuery.error.message}
          </ErrorAlert>
        ) : null}

        {deleteMutation.isError ? (
          <ErrorAlert>
            Could not delete the comment. {deleteMutation.error.message}
          </ErrorAlert>
        ) : null}

        {commentsQuery.data?.items.length === 0 ? (
          <p className="text-sm text-muted">
            No comments yet. Start the conversation above.
          </p>
        ) : null}

        {commentsQuery.data?.items.map((comment) => {
          const name = userName(comment.user);
          const postedAt = formatCommentTime(comment.createdAt);
          const confirming = confirmingId === comment._id;
          const deleting =
            deleteMutation.isPending && deleteMutation.variables === comment._id;

          return (
            <article className="flex gap-3" key={comment._id}>
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground"
              >
                {initialsOf(name)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {name}
                    </p>
                    {postedAt ? (
                      <time
                        className="shrink-0 text-xs text-muted"
                        dateTime={comment.createdAt}
                      >
                        {postedAt}
                      </time>
                    ) : null}
                  </div>

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
                        <Button
                          disabled={deleting}
                          onClick={cancelDelete}
                          size="sm"
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          aria-label={`Confirm delete comment by ${name}`}
                          loading={deleting}
                          onClick={() => confirmDelete(comment._id)}
                          size="sm"
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        aria-label={`Delete comment by ${name}`}
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          deleteMutation.reset();
                          setConfirmingId(comment._id);
                        }}
                        size="icon"
                        title="Delete comment"
                        variant="ghost"
                      >
                        <FiTrash2 aria-hidden="true" size={15} />
                      </Button>
                    )}
                  </div>
                </div>

                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground">
                  {comment.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}