import { createClient } from '@/supabase/server';
import { TournamentList } from '@/components/tournaments/TournamentList';
import { PaginationControls } from '@/components/utils/PaginationControls';
import { LinkButton } from '@/components/utils/LinkButton';
import { PageWrapper } from '@/components/layout/PageWrapper';

const PAGE_SIZE = 10;

const fetchTournaments = async (page: number) => {
    const supabase = createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await (await supabase)
        .from('tournaments')
        .select('id, name, status, start_date, end_date, locations(name, city), events(count)', { count: 'exact' })
        .order('start_date', { ascending: false })
        .range(from, to);

    if (error || !data) {
        console.error("Error fetching tournaments:", error);
        return { tournaments: [], totalCount: 0 };
    }
    // console.dir(data, {depth: null});
    return { tournaments: data || [], totalCount: count || 0 };
};


export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const filters = await searchParams;
    const pageParam = filters.page;
    const pageString = Array.isArray(pageParam) ? pageParam[0] : pageParam;
    const parsedPage = parseInt(pageString ?? '1', 10);
    const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    //totalCount is for pagination
    const { tournaments, totalCount } = await fetchTournaments(currentPage);

    return (
        <PageWrapper>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Tournaments</h1>
                    <p className="mt-1 text-lg text-gray-600">Browse all upcoming and past events.</p>
                </div>
                <div>
                    <LinkButton href="/tournaments/create">
                        Create Tournament
                    </LinkButton>
                </div>
            </div>

            <TournamentList tournaments={tournaments} />

            <PaginationControls
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                currentPage={currentPage}
            />
        </PageWrapper>
    );
};