import { updateParticipantHandler } from "@/lib/services/ParticipantService";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateParticipants = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateParticipantHandler,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['participants']});
        }
    })
}