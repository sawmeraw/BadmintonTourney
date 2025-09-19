import { EventQueryResult } from "@/supabase/queryTypes";

interface EventHeaderProps {
  event: Pick<EventQueryResult, "name" | "tournaments">
}

export const EventHeader = ({ event }: EventHeaderProps) => {
  return (
    <div className="border-b border-gray-200 pb-4 pt-4">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {event.name}
      </h1>
      {event.tournaments && (
        <p className="mt-1 text-lg text-gray-600">
          Part of the <span className="font-semibold">{event.tournaments.name}</span>
        </p>
      )}
    </div>
  );
};