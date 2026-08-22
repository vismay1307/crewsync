import { InvitationReview } from "@/features/invitations/components/invitation-review";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <InvitationReview token={token} />;
}
