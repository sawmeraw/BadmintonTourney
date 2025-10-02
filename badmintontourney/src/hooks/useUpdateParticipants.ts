import { updateParticipantHandler, setSeedHandler } from "@/lib/actions/ParticipantActions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useUpdateParticipants = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateParticipantHandler,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['participants']});
            toast.success("Participants updated", {
                duration: 3000
            });
        },
        onError: ()=>{
            toast.error("Error occurred", {
                duration: 3000
            });
        }
    })
}

export const useUpdateSeed = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setSeedHandler,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['participants']});
            // toast.success("Seed updated", {
            //     duration: 3000
            // });
        },
        onError: (error)=>{
            toast.error(error.message, {
                duration: 3000,
            });
        }
    })
}