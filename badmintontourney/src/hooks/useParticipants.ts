import { useQuery } from "@tanstack/react-query";

import {type ParticipantListApiResponse } from "@/lib/types/api";

const fetchParticipants = async (eventId :string, page: number, pageSize: number) : Promise<ParticipantListApiResponse>=>{
    const response = await fetch(`/api/participants/${eventId}`)
    if(!response.ok) throw new Error("Failed to fetch participants.");
    const data = await response.json();
    console.log(data);
    return data as ParticipantListApiResponse; 
}

export const useParticipants = (eventId: string, page: number, pageSize: number, initialData?: ParticipantListApiResponse) =>{

    const queryOptions = {
        queryKey: ['participants', eventId],
        queryFn: ()=> fetchParticipants(eventId, page, pageSize),
        enabled: !!eventId,
    }
    return useQuery<ParticipantListApiResponse>({
        ...queryOptions,
        ...(page === 1 && initialData ? initialData : {})
    });
}