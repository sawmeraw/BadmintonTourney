type Match = {
  id: string;
  status: string;
  winner_id: string | null;
  participant1: { id: string };
  participant2: { id: string } | null;
};

type Standings = {
  wins: number;
  losses: number;
};

export function buildStandings(matches: Match[]): Record<string, Standings> {
  const standings: Record<string, Standings> = {};

  for (const match of matches) {
    if (match.status !== "completed") continue;

    const p1Id = match.participant1.id;
    const p2Id = match.participant2?.id;

    if (!standings[p1Id]) standings[p1Id] = { wins: 0, losses: 0 };
    if (p2Id && !standings[p2Id]) standings[p2Id] = { wins: 0, losses: 0 };

    if (match.winner_id) {
      standings[match.winner_id].wins++;
      const loserId = match.winner_id === p1Id ? p2Id : p1Id;
      if (loserId) standings[loserId].losses++;
    }
  }

  return standings;
}

export function getStandings(
  id: string,
  standingsMap: Record<string, Standings>
): Standings {
  return standingsMap[id] ?? { wins: 0, losses: 0 };
}
