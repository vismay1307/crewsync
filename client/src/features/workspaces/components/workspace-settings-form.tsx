"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUpdateWorkspaceSettingsMutation,
  useWorkspaceSettingsQuery,
} from "@/features/workspaces/hooks/use-workspace-queries";

export function WorkspaceSettingsForm({ workspaceId }: { workspaceId: string }) {
  const settingsQuery = useWorkspaceSettingsQuery(workspaceId);

  if (settingsQuery.isPending) {
    return <p className="text-sm text-muted">Loading settings</p>;
  }

  if (settingsQuery.isError) {
    return <p className="text-sm text-destructive">{settingsQuery.error.message}</p>;
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateMutation.mutate({
      timezone: timezone || undefined,
      defaultRole,
      colorTheme: colorTheme || undefined,
    });
  }

  return (
    <form className="max-w-xl space-y-4 rounded-lg border border-border bg-card p-5" onSubmit={handleSubmit}>
      <Input
        label="Timezone"
        name="timezone"
        onChange={(event) => setTimezone(event.target.value)}
        placeholder="Asia/Calcutta"
        value={timezone}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium" htmlFor="defaultRole">
          Default invitation role
        </label>
        <select
          className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          id="defaultRole"
          onChange={(event) => setDefaultRole(event.target.value as "admin" | "member")}
          value={defaultRole}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Input
        label="Color theme"
        name="colorTheme"
        onChange={(event) => setColorTheme(event.target.value)}
        value={colorTheme}
      />
      {updateMutation.isError ? (
        <p className="text-sm text-destructive">{updateMutation.error.message}</p>
      ) : null}
      <Button disabled={updateMutation.isPending} type="submit">
        {updateMutation.isPending ? "Saving" : "Save settings"}
      </Button>
    </form>
  );
}
