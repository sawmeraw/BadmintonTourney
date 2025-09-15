create table tournaments{
    id uuid,
    name text,
    start_date date,
    end_date date,
    location_id uuid references locations(id),
    status text check in ('upcoming', 'ongoing', 'completed')
    created_at timestamp,
    updated_at timestamp
}

create table locations{
    id uuid,
    building_name text,
    address_line1 text,
    address_line2 text,
    city text,
    state text check in ('NT', 'SA', 'VIC', 'NSW', 'WA', 'TAS'),
    created_at timestamp,
    updated_at timestamp
}

create table participants{
    id uuid,
    event_id uuid references events(id),
    tournament_id uuid references tournament(id),
    is_doubles boolean default false,
    is_bye boolean default false,
    player1_id uuid references players(id),
    player2_id uuid references players(id),
    has_lost_event boolean default false,
    is_disqualified boolean default false,
    is_retired_hurt boolean default false,
    created_at timestamp,
    updated_at timestamp
}

create table players{
    id uuid,
    name text not null,
    state text check in ('NT', 'SA', 'VIC', 'NSW', 'WA', 'TAS'),
    date_of_birth date, --for age
    profile_image text,
    created_at timestamp,
    updated_at timestamp
}

--events for the tournament
create table events{
    id uuid,
    eventtype_id uuid references eventtypes(id),
    tournament_id uuid references tournaments(id),
    name text, --override
    description text,
    is_complete text,
    created_at timestamp,
    updated_at timestamp
}

create table event_rounds{
    id uuid,
    event_id uuid references events(id),
    name text not null,
    roundtype_id uuid references round_types(id),
    top_k_pool integer,
    top_k_knockout integer,
    total_matches integer,
    is_complete boolean,
    sequence integer,
    created_at timestamp,
    updated_at timestamp
}

create table pools{
    id uuid,
    event_round_id uuid references event_rounds(id),
    name text not null,
    is_complete boolean default false,
    created_at timestamp,
    updated_at timestamp
}

create table pool_participants{
    id uuid,
    pool_id uuid references pools(id),
    participant_id uuid references participants(id),
    created_at timestamp,
    updated_at timestamp
}

--knockout, pool, finals etc.
create table round_types{
    id uuid,
    name text not null,
    is_round_robin boolean default false,
    is_knockout boolean default false,
    is_final_round boolean default false,
    is_pool boolean default false,
    default_top_k_pool integer,
    default_top_k_knockout integer,
    created_at timestamp,
    updated_at timestamp
}

--Mens singles, mens doubles etc.
create table eventtypes{
    id uuid,
    name text,
    is_doubles boolean,
    age_upper_limit integer,
    age_lower_limit integer,
    ignore_age_upper_limit boolean,
    ignore_age_lower_limit boolean,
    created_at timestamp,
    updated_at timestamp
}

create table matches{
    id uuid,
    event_round_id uuid references event_rounds(id),
    pool_id uuid references pools(id),
    participant1_id uuid references participants(id),
    participant2_id uuid references participants(id),
    participant1_total_points integer,
    participant2_total_points integer,
    winner_participant_id uuid references participants(id),
    status text check in ('scheduled, completed'),
    next_match_id uuid references matches(id),
    created_at timestamp,
    updated_at timestamp
}

create table matchsets{
    id uuid,
    set_number integer,
    match_id uuid references matches(id),
    participant1_score integer,
    participant2_score integer,
    winner_participant_id uuid references participants(id)
    created_at timestamp,
    updated_at timestamp
}
