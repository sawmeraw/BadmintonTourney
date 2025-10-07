import Button from "@mui/material/Button";

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
          <Button
            href={`/admin/t/${tournamentId}/e/${event.id}`}
            variant="outlined"
            color="primary"
          >
            Configure
          </Button>
        </li>
      ))}
    </ul>
    <div className="pt-4 border-t border-gray-200">
      <Button
        href={`/admin/t/${tournamentId}/e/create`}
        variant="contained"
        color="primary"
        className="w-full"
      >
        + Add Another Event
      </Button>
    </div>
  </div>
);

export const NoEvents = ({ tournamentId }: { tournamentId: string | undefined}) => (
  <div className="text-center py-4">
    <p className="text-sm text-gray-500 mb-4">This tournament has no events yet.</p>
    <Button href={`/admin/t/${tournamentId}/e/create`}>
      Create Your First Event
    </Button>
  </div>
);