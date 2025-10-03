'use client';

import { ConfirmationModal } from "../utils/ConfirmationModal";

interface EventConfirmationModalProps{
    isOpen: boolean;
    onClose: ()=> void;
    onConfirm: ()=> void;
    currentEntries: number;
    maxParticipants: number;
}

export default function EventConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    currentEntries,
    maxParticipants
} : EventConfirmationModalProps){

    const byes = maxParticipants - currentEntries;
    let byeWarning : string = `For straight knockout, it will create ${byes} byes.`;

    if(maxParticipants)
    return(
        <ConfirmationModal 
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Finalize event?"
            confirmText="Confirm"
            >
                <div>
                    <p>You are about to finalize this event. This will lock registrations and generate the matches automatically.</p>
                    <div className="mt-2">
                        <p>
                            <strong>Max Participants: </strong>
                            {maxParticipants || "Not Set"}
                        </p>
                        <p>
                            <strong>Current Entries: </strong>
                            {currentEntries}
                        </p>
                        {maxParticipants > 0 && <p className="mt-2">
                                {byeWarning}
                            </p>}
                        <p className="mt-2">This action cannot be undone. Are you sure you want to proceed?</p>
                    </div>
                </div>

        </ConfirmationModal>
    )
}
