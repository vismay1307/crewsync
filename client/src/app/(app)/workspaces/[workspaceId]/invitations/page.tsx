import { InvitationForm } from "@/features/invitations/components/invitation-form";
import { InvitationList } from "@/features/invitations/components/invitation-list";

export default async function WorkspaceInvitationsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Invitations</h1>
          <p className="cs-page-description">Manage pending and historical workspace invites.</p>
        </div>
        <InvitationList workspaceId={workspaceId} />
      </section>
      <aside className="cs-form-card p-5">
        <h2 className="mb-4 cs-section-title">Invite member</h2>
        <InvitationForm workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
