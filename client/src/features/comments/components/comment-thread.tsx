"use client";

import { FormEvent, useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
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

  const apiError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error?.message;

  return (
    <section className="max-w-2xl rounded-lg border border-border bg-card p-5">
      <h2 className="text-base font-semibold">Comments</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          maxLength={5000}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add a comment"
          value={body}
        />
        {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
        <Button disabled={!canSubmit} type="submit">
          {createMutation.isPending ? "Posting" : "Post comment"}
        </Button>
      </form>
      <div className="mt-5 space-y-3">
        {commentsQuery.isPending ? <p className="text-sm text-muted">Loading comments</p> : null}
        {commentsQuery.isError ? (
          <p className="text-sm text-destructive">{commentsQuery.error.message}</p>
        ) : null}
        {commentsQuery.data?.items.length === 0 ? (
          <p className="text-sm text-muted">No comments yet</p>
        ) : null}
        {commentsQuery.data?.items.map((comment) => (
          <article className="rounded-md border border-border p-3" key={comment._id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{userName(comment.user)}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{comment.body}</p>
              </div>
              <Button
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(comment._id)}
                variant="ghost"
              >
                <FiTrash2 size={15} />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
