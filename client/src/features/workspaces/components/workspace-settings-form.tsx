"use client";

import { type FormEvent, useState } from "react";
import { FiCheck } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useUpdateWorkspaceSettingsMutation,
  useWorkspaceSettingsQuery,
} from "@/features/workspaces/hooks/use-workspace-queries";

function SettingsSkeleton() {
  return (
    <div aria-busy="true" className="cs-form-card max-w-2xl p-5">
      <div className="space-y-5">
        {[0, 1, 2].map((index) => (
          <div className="space-y-2" key={index}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      <span className="sr-only" role="status">
        Loading settings
      </span>
    </div>
  );
}

export function WorkspaceSettingsForm({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const settingsQuery = useWorkspaceSettingsQuery(workspaceId);

  if (settingsQuery.isPending) {
    return <SettingsSkeleton />;
  }

  if (settingsQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={settingsQuery.isFetching}
            onClick={() => void settingsQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {settingsQuery.error.message}
      </ErrorAlert>
    );
  }

  return (
    <WorkspaceSettingsFields
      colorTheme={settingsQuery.data.colorTheme ?? ""}
      defaultRole={settingsQuery.data.defaultRole ?? "member"}
      key={settingsQuery.data._id}
      timezone={settingsQuery.data.timezone ?? ""}
      workspaceId={workspaceId}
    />
  );
}

function WorkspaceSettingsFields({
  colorTheme: initialColorTheme,
  defaultRole: initialDefaultRole,
  timezone: initialTimezone,
  workspaceId,
}: {
  colorTheme: string;
  defaultRole: "admin" | "member";
  timezone: string;
  workspaceId: string;
}) {
  const updateMutation = useUpdateWorkspaceSettingsMutation(workspaceId);

  const [timezone, setTimezone] = useState(initialTimezone);
  const [defaultRole, setDefaultRole] =
    useState<"admin" | "member">(initialDefaultRole);
  const [colorTheme, setColorTheme] = useState(initialColorTheme);

  const dirty =
    timezone !== initialTimezone ||
    defaultRole !== initialDefaultRole ||
    colorTheme !== initialColorTheme;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dirty || updateMutation.isPending) return;

    updateMutation.mutate({
      timezone: timezone || undefined,
      defaultRole,
      colorTheme: colorTheme || undefined,
    });
  }

  function handleDiscard() {
    setTimezone(initialTimezone);
    setDefaultRole(initialDefaultRole);
    setColorTheme(initialColorTheme);
    updateMutation.reset();
  }

  return (
    <form className="cs-form-card max-w-2xl" onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Workspace preferences</CardTitle>

        <CardDescription>
          Timezone, invitation defaults, and color theme for this workspace.
        </CardDescription>
      </CardHeader>

      <div className="space-y-5 p-5">
        <Input
          hint="Example: Asia/Calcutta or UTC."
          label="Timezone"
          name="timezone"
          onChange={(event) => setTimezone(event.target.value)}
          placeholder="Asia/Calcutta"
          value={timezone}
        />

        <Select
          label="Default invitation role"
          name="defaultRole"
          onChange={(event) =>
            setDefaultRole(event.target.value as "admin" | "member")
          }
          value={defaultRole}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </Select>

        <Input
          label="Color theme"
          name="colorTheme"
          onChange={(event) => setColorTheme(event.target.value)}
          value={colorTheme}
        />

        {updateMutation.isError ? (
          <ErrorAlert>{updateMutation.error.message}</ErrorAlert>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
        <p
          className="inline-flex min-h-5 items-center gap-1.5 text-sm text-success"
          role="status"
        >
          {updateMutation.isSuccess && !dirty ? (
            <>
              <FiCheck aria-hidden="true" size={14} />
              Settings saved.
            </>
          ) : null}
        </p>

        <div className="flex items-center gap-3">
          <Button
            disabled={!dirty || updateMutation.isPending}
            onClick={handleDiscard}
            variant="secondary"
          >
            Discard changes
          </Button>

          <Button
            disabled={!dirty}
            loading={updateMutation.isPending}
            type="submit"
          >
            {updateMutation.isPending ? "Saving" : "Save settings"}
          </Button>
        </div>
      </div>
    </form>
  );
}