import { InvitationForm } from "@/features/invitations/components/invitation-form";
import { InvitationList } from "@/features/invitations/components/invitation-list";

export default async function WorkspaceInvitationsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Invitations</h1>
          <p className="mt-1 text-sm text-muted">Manage pending and historical workspace invites.</p>
        </div>
        <InvitationList workspaceId={workspaceId} />
      </section>
      <aside className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold">Invite member</h2>
        <InvitationForm workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
