import { createClient } from "@/supabase/server";

type CreateKnockoutRoundsRPCPayload = {
    p_event_id: string;
    p_rounds_data: {
        name: string;
        sequence: number;
        round_type_id: string;
    }[];
};

export async function _generateStraightKnockoutRounds(
    eventId: string,
    participantCount: number
) {
    let roundsPayload: CreateKnockoutRoundsRPCPayload = {
        p_event_id: eventId,
        p_rounds_data: [],
    };
    //log 2 of the count since each round halves the players
    const numRounds = Math.ceil(Math.log2(participantCount));
    // console.log(participantCount);
    //2^6 would give 64 (lets say count was 50) then we can use this to calculate how many byes we need
    let currentBracketSize = Math.pow(2, numRounds);

    const numByes = currentBracketSize - participantCount;

    const roundTypes = await getAllRoundTypes();

    const singleElimRoundTypeId = roundTypes.find(
        (type) => type.name === "Single Elimination"
    )?.id;

    if (numByes > 0 && numByes < participantCount) {
        const prelimRoundId = roundTypes.find(
            (type) => type.name === "Preliminary Round"
        )?.id;
        roundsPayload.p_rounds_data.push({
            name: "Preliminary Round",
            sequence: 1,
            round_type_id: prelimRoundId!,
        });
        currentBracketSize /= 2;
    }

    let sequence = roundsPayload.p_rounds_data.length + 1;

    while (currentBracketSize >= 2) {
        let roundName = "";
        if (currentBracketSize === 2) roundName = "Finals";
        else if (currentBracketSize === 4) roundName = "Semi-Finals";
        else if (currentBracketSize === 8) roundName = "Quarter-Finals";
        else roundName = `Round of ${currentBracketSize}`;

        roundsPayload.p_rounds_data.push({
            name: roundName,
            sequence: sequence,
            round_type_id: singleElimRoundTypeId!,
        });

        sequence++;
        currentBracketSize /= 2;
    }

    console.log("Rounds payload: ", roundsPayload);

    try {
        await createKnockoutRoundsAndMatchesRPC(roundsPayload);
    } catch (error) {
        throw error;
    }

    try {
        await createFirstRoundMatches(eventId);
    } catch (error) {
        throw error;
    }
}

async function getAllRoundTypes() {
    const supabase = await createClient();

    const { data, error } = await supabase.from("round_types").select("*");

    if (!data || error) throw error;

    return data;
}

//round groups just needs the round id
//create round groups; for knockout it would just main bracket for each round
//for pools, it would be creating different groups using round_id which would then be referenced in the matches table
//rounds table needs the template id
async function createKnockoutRoundsAndMatchesRPC(
    payload: CreateKnockoutRoundsRPCPayload
) {
    const supabase = await createClient();

    const { error: knockoutError } = await supabase.rpc(
        "create_knockout_rounds_and_groups",
        {
            p_event_id: payload.p_event_id,
            p_rounds_data: payload.p_rounds_data,
        }
    );

    console.log("Error:", knockoutError);
    if (knockoutError) throw new Error("Failed to create rounds for the event");
}

async function createFirstRoundMatches(eventId: string) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("generate_initial_knockout_matches", {
        p_event_id: eventId,
    });

    console.log(error);
    if (error) throw new Error("Failed to create first round of matches");

    console.log("First round of matches created");
}
