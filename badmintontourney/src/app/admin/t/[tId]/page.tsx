import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TournamentForm } from "../_components/TournamentEditForm";
import { getTournamentForEdit, getAllLocations } from "@/lib/services/TournamentService";

export default async function EditTournamentPage({
  params,
}: {
  params: Promise<{ tId: string }>
}) {
    const {tId} = await params;
    const [tournament, locations] = await Promise.all([
        getTournamentForEdit(tId),
        getAllLocations(),
    ]);

    if (!tournament) notFound();

    return (
        <PageWrapper>
            <div className="mb-6">
                <h3 className="text-3xl font-bold">Edit Tournament</h3>
            </div>
            <TournamentForm initialData={tournament} locations={locations} />
        </PageWrapper>
    );
}