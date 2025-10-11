import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
    getTournamentForEdit,
    getAllLocations,
} from "@/lib/services/TournamentService";
import TournamentEditForm from "../_components/TournamentEditForm";

export default async function EditTournamentPage({
    params,
}: {
    params: Promise<{ tId: string }>;
}) {
    const { tId } = await params;
    const [tournament, locations] = await Promise.all([
        getTournamentForEdit(tId),
        getAllLocations(),
    ]);

    if (!tournament) notFound();

    return (
        <PageWrapper>
            <div className="my-4">
                <h3 className="text-2xl font-bold">Edit Tournament</h3>
            </div>
            <TournamentEditForm
                initialData={tournament}
                locations={locations}
                events={tournament.events}
            />
        </PageWrapper>
    );
}
