-- Define reusable ENUM types for better data integrity
CREATE TYPE tournament_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE match_status AS ENUM ('scheduled', 'in_progress', 'completed', 'walkover', 'cancelled');
CREATE TYPE participant_status AS ENUM ('active', 'withdrawn', 'disqualified');

-- A tournament is the top-level container
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location_id UUID REFERENCES locations(id),
    status tournament_status NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Physical location of the tournament
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT, -- You can use an ENUM here too if states are fixed
    postcode TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual players
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    state TEXT,
    date_of_birth DATE,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Templates for events (e.g., "Men's Singles U19")
CREATE TABLE event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    is_doubles BOOLEAN NOT NULL DEFAULT false,
    age_upper_limit INTEGER,
    age_lower_limit INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- An instance of an event_type within a specific tournament
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id),
    event_type_id UUID NOT NULL REFERENCES event_types(id),
    name TEXT, -- Optional override name, e.g., "A-Grade Men's Singles"
    is_complete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Represents a player or a pair's entry into a specific event
CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id),
    player1_id UUID NOT NULL REFERENCES players(id),
    player2_id UUID REFERENCES players(id), -- NULL for singles
    status participant_status NOT NULL DEFAULT 'active',
    -- Seeding information can be added here
    seed INTEGER,
    -- Ensure a pair of players is unique within an event
    UNIQUE(event_id, player1_id, player2_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Defines the type of a round (e.g., Pool Stage, Knockout)
CREATE TABLE round_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g., 'Round Robin', 'Single Elimination', 'Finals'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A specific stage of an event, like "Pool Stage" or "Quarter-Finals"
CREATE TABLE event_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id),
    round_type_id UUID NOT NULL REFERENCES round_types(id),
    name TEXT NOT NULL, -- "Pool Stage", "Round of 16", "Finals"
    sequence INTEGER NOT NULL, -- To order the rounds (1, 2, 3...)
    num_qualifiers_per_group INTEGER,
    is_complete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A generic grouping within a round. For a pool stage, these are pools. For a knockout, this could be the main bracket.
CREATE TABLE round_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_round_id UUID NOT NULL REFERENCES event_rounds(id),
    name TEXT NOT NULL, -- "Pool A", "Main Bracket", "Bronze Medal Match"
    is_complete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Links participants to a specific group for a round
CREATE TABLE group_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_group_id UUID NOT NULL REFERENCES round_groups(id),
    participant_id UUID NOT NULL REFERENCES event_participants(id),
    -- You can store pool-specific results here, like points, games won/lost
    rank INTEGER, -- Final rank within the group
    UNIQUE(round_group_id, participant_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The core match entity
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_round_id UUID NOT NULL REFERENCES event_rounds(id),
    round_group_id UUID REFERENCES round_groups(id), -- Can be NULL if a round doesn't use groups
    participant1_id UUID REFERENCES event_participants(id),
    participant2_id UUID REFERENCES event_participants(id), -- A NULL value here represents a BYE
    winner_id UUID REFERENCES event_participants(id),
    status match_status NOT NULL DEFAULT 'scheduled',
    
    -- For bracket progression
    round_match_number INTEGER, -- e.g., Match 1 in the QF
    winner_feeds_into_match_id UUID REFERENCES matches(id), -- Winner progresses here
    loser_feeds_into_match_id UUID REFERENCES matches(id), -- For double-elimination brackets
    
    start_time TIMESTAMPTZ,
    court_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scores for each set (game) within a match
CREATE TABLE match_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL CHECK (set_number > 0),
    participant1_score INTEGER NOT NULL DEFAULT 0,
    participant2_score INTEGER NOT NULL DEFAULT 0,
    -- Winner can be derived, but storing it can be convenient
    winner_id UUID REFERENCES event_participants(id), 
    UNIQUE(match_id, set_number),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
