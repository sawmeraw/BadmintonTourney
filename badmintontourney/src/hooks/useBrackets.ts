import { useQuery } from "@tanstack/react-query";

import { type EventBracketsApiResponse } from "@/lib/types/api";

const fetchBrackets = async (
    eventId: string
): Promise<EventBracketsApiResponse> => {
    const response = await fetch(`/api/brackets/${eventId}`);
    if (!response.ok) throw new Error("failed to fetch event rounds");
    const data = await response.json();
    console.log(data);
    return data as EventBracketsApiResponse;
};

export const useBrackets = (roundId: string) => {
    return useQuery<EventBracketsApiResponse>({
        queryKey: ["bracket_details", roundId],
        queryFn: () => fetchBrackets(roundId),
        // enabled: !!eventId,
    });
};
