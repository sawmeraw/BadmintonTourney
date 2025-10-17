/**
 * Represents a single score for a set within a match.
 */
export interface BracketScore {
    mainScore: string;
    isWinner?: boolean;
}

/**
 * Represents one side of a match (a single participant or team).
 */
export interface BracketSide {
    contestantId: string;
    scores: BracketScore[];
    isWinner?: boolean;
}

/**
 * Represents a single match in the bracket.
 * A match always has exactly two sides.
 */
export interface BracketMatch {
    roundIndex: number;
    order: number;
    matchStatus?: string; // Optional: for 'Scheduled', 'Cancelled', etc.
    sides: [BracketSide, BracketSide];
}

/**
 * Represents a single player within a contestant entry.
 */
export interface BracketPlayer {
    title: string;
    nationality?: string;
}

/**
 * Represents a contestant in the tournament (a singles player or a doubles team).
 * This is the value part of the contestants map.
 */
export interface BracketContestant {
    entryStatus?: string;
    players: BracketPlayer[];
}

/**

 * The complete, top-level data structure expected by the Bracketry component.
 */
export interface BracketryData {
    rounds: { name: string }[];
    matches: BracketMatch[];
    contestants: Record<string, BracketContestant>; // A map of contestantId to contestant details
}
