import { LinkButton } from "../utils/LinkButton";

interface EventListProps{
    tournamentId : string | undefined;
    events: {
        id: string,
        name: string | null;
    }[];
}

export const EventsList = ({tournamentId, events}: EventListProps ) => (
  <div className="space-y-4">
    <ul className="space-y-3">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-center justify-between rounded-md bg-gray-50 p-3"
        >
          <p className="font-medium text-gray-800">{event.name}</p>
          <LinkButton
            href={`/admin/t/${tournamentId}/e/${event.id}`}
            variant="secondary"
            size="sm"
          >
            Configure
          </LinkButton>
        </li>
      ))}
    </ul>
    <div className="pt-4 border-t border-gray-200">
      <LinkButton
        href={`/admin/t/${tournamentId}/e/create`}
        variant="ghost"
        size="sm"
        className="w-full"
      >
        + Add Another Event
      </LinkButton>
    </div>
  </div>
);

export const NoEvents = ({ tournamentId }: { tournamentId: string | undefined}) => (
  <div className="text-center py-4">
    <p className="text-sm text-gray-500 mb-4">This tournament has no events yet.</p>
    <LinkButton href={`/admin/t/${tournamentId}/e/create`}>
      Create Your First Event
    </LinkButton>
  </div>
);