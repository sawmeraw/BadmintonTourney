// File: app/tournaments/[id]/page.tsx


import { notFound } from "next/navigation";
import { CalendarDaysIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { createClient } from "@/supabase/server";

// This function now fetches real data from Supabase
const getTournamentById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('tournaments')
    .select('*, locations(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }
  console.log(data);
  return data;
};

// A more visually distinct status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    upcoming: "bg-blue-100 text-blue-800 ring-blue-600/20",
    ongoing: "bg-green-100 text-green-800 ring-green-600/20",
    completed: "bg-gray-200 text-gray-800 ring-gray-600/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${
        statusStyles[status.toLowerCase()] || statusStyles.completed
      }`}
    >
      {status}
    </span>
  );
};

// The main page component
export default async function TournamentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tournament = await getTournamentById(params.id);

  // Since getTournamentById now calls notFound(), this check is redundant
  // but good for clarity.
  if (!tournament) {
     notFound();
  }

  const location = Array.isArray(tournament.locations) 
    ? tournament.locations[0] 
    : tournament.locations;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{tournament.name}</h1>
        <p className="mt-2 text-lg text-gray-500">
            A premier badminton event hosted in {location?.city || 'our designated venue'}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Events & Brackets</h2>
            <div className="bg-gray-50 h-64 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Live brackets will be displayed here.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Match Schedule</h2>
             <div className="bg-gray-50 h-48 rounded-md flex items-center justify-center">
              <p className="text-gray-500">The schedule will appear here.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Status</h3>
                <StatusBadge status={tournament.status} />
              </div>
            </div>

            <div className="flex items-start">
              <CalendarDaysIcon className="h-6 w-6 text-blue-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Dates</h3>
                <p className="text-gray-600">
                  {new Date(tournament.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - 
                  {new Date(tournament.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {location && (
              <div className="flex items-start">
                <MapPinIcon className="h-6 w-6 text-blue-500 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Venue</h3>
                  <p className="text-gray-600">{location.name}</p>
                  <p className="text-sm text-gray-500">{location.address_line1}, {location.city}</p>
                  <p className="text-xs text-gray-500">{location.postcode} {location.state}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}