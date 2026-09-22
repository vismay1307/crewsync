import { MemberForm } from "@/features/members/components/member-form";
import { MemberList } from "@/features/members/components/member-list";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Members</h1>
          <p className="cs-page-description">Roles are limited to owner, admin, and member.</p>
        </div>
        <MemberList workspaceId={workspaceId} />
      </section>
      <aside className="cs-form-card p-5">
        <h2 className="mb-4 cs-section-title">Add member</h2>
        <MemberForm workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
