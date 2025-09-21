import { useQuery } from "@tanstack/react-query";

import {type EventRoundDetailsApiResponse } from "@/lib/types/api";

const fetchRounds = async (roundId :string) : Promise<EventRoundDetailsApiResponse>=>{
    const response = await fetch(`/api/rounds/${roundId}`)
    if(!response.ok) throw new Error("failed to fetch round details");
    const data = await response.json();
    console.log(data);
    return data as EventRoundDetailsApiResponse;
}

export const useRounds = (roundId: string) =>{
    return useQuery<EventRoundDetailsApiResponse>({
        queryKey: ['round_details', roundId],
        queryFn: ()=> fetchRounds(roundId),
        // enabled: !!eventId,
    })
}