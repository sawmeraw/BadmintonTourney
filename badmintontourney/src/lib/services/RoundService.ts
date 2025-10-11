import { createClient } from "@/supabase/server";

export async function _generateStraightKnockoutRounds(
    eventId: string,
    participantCount: number
) {
    const roundsToCreate = [];
    const groupsToCreate = [];

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
        roundsToCreate.push({
            event_id: eventId,
            name: "Preliminary Round",
            sequence: 1,
            round_type_id: prelimRoundId,
        });
        currentBracketSize /= 2;
    }

    let sequence = roundsToCreate.length + 1;

    while (currentBracketSize >= 2) {
        let roundName = "";
        if (currentBracketSize === 2) roundName = "Finals";
        else if (currentBracketSize === 4) roundName = "Semi-Finals";
        else if (currentBracketSize === 8) roundName = "Quarter-Finals";
        else roundName = `Round of ${currentBracketSize}`;

        roundsToCreate.push({
            event_id: eventId,
            name: roundName,
            sequence: sequence,
            round_type_id: singleElimRoundTypeId,
        });

        sequence++;
        currentBracketSize /= 2;
    }
    console.log(roundsToCreate);
}

async function getAllRoundTypes() {
    const supabase = await createClient();

    const { data, error } = await supabase.from("round_types").select("*");

    if (!data || error) throw error;

    return data;
}
