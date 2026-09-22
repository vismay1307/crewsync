import { LabelForm } from "@/features/labels/components/label-form";
import { LabelList } from "@/features/labels/components/label-list";

export default async function LabelsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Labels</h1>
          <p className="cs-page-description">Workspace labels for organizing tasks.</p>
        </div>
        <LabelList workspaceId={workspaceId} />
      </section>
      <aside className="cs-form-card p-5">
        <h2 className="mb-4 cs-section-title">Create label</h2>
        <LabelForm workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
