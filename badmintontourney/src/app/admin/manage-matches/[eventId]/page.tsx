import { PageWrapper } from "@/components/layout/PageWrapper";
import { MatchManagerUI } from "./_components/MatchManagerUI";

export default async function ManageMatchesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return (
    <PageWrapper>
      <MatchManagerUI />
    </PageWrapper>
  );
}
