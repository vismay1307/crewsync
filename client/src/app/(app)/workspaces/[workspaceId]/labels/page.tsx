import { LabelForm } from "@/features/labels/components/label-form";
import { LabelList } from "@/features/labels/components/label-list";

export default async function LabelsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Labels</h1>
          <p className="mt-1 text-sm text-muted">Workspace labels for organizing tasks.</p>
        </div>
        <LabelList workspaceId={workspaceId} />
      </section>
      <aside className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold">Create label</h2>
        <LabelForm workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
