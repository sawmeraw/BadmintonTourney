import { differenceInCalendarDays, parseISO } from 'date-fns';
import { LinkButton } from './LinkButton';

export const RegistrationStatus = ({ startDate, tournament_id }: { startDate: string, tournament_id: string }) => {
  const today = new Date();
  const tournamentStart = parseISO(startDate);
  const daysUntilStart = differenceInCalendarDays(tournamentStart, today);

  if (daysUntilStart >= 3) {
    return (
        <LinkButton href={`/tournaments/${tournament_id}/register`} size="lg">
            Register Now
        </LinkButton>
    );
  }

  return (
    <div className="text-sm text-gray-600">
      Registration closed. Please contact the tournament admin.
    </div>
  );
};
