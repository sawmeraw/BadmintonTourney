import Link from 'next/link';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import type { Database } from '@/supabase/types';
import { StatusBadge } from '../utils/StatusBadge';
import { TournamentListItem } from '@/supabase/queryTypes';


export const TournamentCard = ({ tournament }: { tournament: TournamentListItem }) => {
    const eventCount = tournament.events[0]?.count ?? 0;
    // console.dir(tournament, {depth: null});

    return (
        <div className="relative flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="absolute top-4 right-4">
                <StatusBadge status={tournament.status} />
            </div>
            <div className="flex-1 p-6">
                <h3 className="text-xl font-semibold text-gray-900 pr-24">
                    <Link href={`/tournaments/${tournament.id}`} className="hover:text-emerald-800 duration-300">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {tournament.name}
                    </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    {eventCount} {eventCount === 1 ? 'Event' : 'Events'}
                </p>
            </div>
            <div className="border-t border-gray-200 p-6">
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                        <span>
                            {new Date(tournament.start_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - {new Date(tournament.end_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}, {new Date(tournament.start_date).toLocaleDateString(undefined, {year: 'numeric'})}
                        </span>
                    </div>
                    {tournament.locations && tournament.locations[0] ? (
                        <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                            <span>{tournament.locations[0].name != "" ? tournament.locations[0].name : ""}, {tournament.locations[0].city != "" ? tournament.locations[0].city : "" }</span>
                        </div>
                    ) : 
                        <div className='flex items-center'>
                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                            <span className='text-red-400'>Location not provided.</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};