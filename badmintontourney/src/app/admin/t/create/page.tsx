import { PageWrapper } from "@/components/layout/PageWrapper";
import TournamentEditForm from "../_components/TournamentEditForm";
import { getAllLocations } from "@/lib/services/TournamentService";

export default async function CreateTournamentPage() {
    const locations = await getAllLocations();

    return (
        <PageWrapper>
            <div className="my-4">
                <h1 className="text-3xl font-bold">Create New Tournament</h1>
            </div>
            <TournamentEditForm locations={locations} />
        </PageWrapper>
    );
}