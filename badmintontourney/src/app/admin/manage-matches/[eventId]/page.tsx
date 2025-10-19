import { MatchManagerUI } from "./_components/MatchManagerUI";

export default async function ManageMatchesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  <MatchManagerUI />;
}
