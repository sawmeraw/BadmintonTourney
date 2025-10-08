"use client";

import { Fragment, useState } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import Button from "@mui/material/Button";
import { PlayerBase } from "@/lib/types/api";
import { PlayerInput } from "./PlayerInput";
import { CreateParticipantPayload } from "@/lib/types/writes";
import { useCreateParticipant } from "@/hooks/useUpdateParticipants";
import { Checkbox, FormControlLabel } from "@mui/material";
import toast from "react-hot-toast";

interface AddParticipantModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDoubles: boolean;
    eventId: string;
    allPlayers: PlayerBase[];
}

export function AddParticipantModal({
    isOpen,
    onClose,
    isDoubles,
    eventId,
    allPlayers,
}: AddParticipantModalProps) {
    const [formState, setFormState] = useState<CreateParticipantPayload>({
        player1: { mode: "existing", player_id: "" },
        player2: { mode: "existing", player_id: "" },
        autoSeed: true,
        event_type: isDoubles ? "doubles" : "singles",
        event_id: eventId,
    });

    const { mutateAsync: createParticipant, isPending } =
        useCreateParticipant();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: CreateParticipantPayload = {
            event_id: eventId,
            event_type: isDoubles ? "doubles" : "singles",
            player1: formState.player1,
            player2: isDoubles ? formState.player2 : undefined,
            autoSeed: formState.autoSeed,
        };

        try {
            await createParticipant(payload);
        } catch (error) {
            console.log(error);
        }
        onClose();
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                onClose={onClose}
                className="relative top-1/2 left-1/2 z-50"
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/50 rounded-lg"
                        aria-hidden="true"
                    />
                </TransitionChild>
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        {isPending && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                            </div>
                        )}
                        <div className="bg-white pt-5">
                            <DialogTitle className="text-xl font-semibold text-gray-900 px-4">
                                Add {isDoubles ? "Team" : "Participant"}
                            </DialogTitle>

                            <form onSubmit={handleSubmit} className="mt-2">
                                <PlayerInput
                                    playerNumber={1}
                                    allPlayers={allPlayers}
                                    value={formState.player1}
                                    onChange={(val) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            player1: val,
                                        }))
                                    }
                                />

                                {isDoubles && (
                                    <PlayerInput
                                        playerNumber={2}
                                        allPlayers={allPlayers}
                                        value={formState.player2}
                                        onChange={(val) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                player2: val,
                                            }))
                                        }
                                    />
                                )}

                                <div className="py-2">
                                    <div className="grid grid-cols-2 gap-4 items-end">
                                        <div className="relative flex items-center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        id="autoSeed"
                                                        checked={
                                                            formState.autoSeed
                                                        }
                                                        onChange={(e) =>
                                                            setFormState(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    autoSeed:
                                                                        e.target
                                                                            .checked,
                                                                    seed: "",
                                                                })
                                                            )
                                                        }
                                                        sx={{
                                                            p: 0.5,
                                                            "&.Mui-checked": {
                                                                color: "#059669",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <span className="font-medium text-gray-900 text-sm whitespace-nowrap">
                                                        Auto-seed{" "}
                                                        <span className="text-xs font-normal">
                                                            (Uncheck if manually
                                                            seeding later)
                                                        </span>
                                                    </span>
                                                }
                                                sx={{ ml: 1.5 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end bg-gray-50 gap-2 px-4 py-2">
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </Transition>
    );
}
