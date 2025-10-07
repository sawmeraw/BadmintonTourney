import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useParticipantContext } from "../_context/ParticipantManagerContext";
import { ParticipantStatus } from "@/lib/services/ParticipantService";
import { Button, TextField, MenuItem } from "@mui/material";

interface StatusModalProps {
  isOpen: boolean;
  // onConfirm: ()=>void;
}

export default function StatusModal({ isOpen }: StatusModalProps) {
  const { updateStatusSelected, toggleStatusModal } = useParticipantContext();
  const [statusValue, setStatusValue] = useState<ParticipantStatus>("active");

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={toggleStatusModal}
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
            <div className="bg-white pt-5">
              <DialogTitle className="text-xl font-semibold text-gray-900 px-4">
                Update Participant Status
              </DialogTitle>
            </div>

            <div className="p-4 flex flex-col bg-gray-50">
              <TextField
                select
                label="Status"
                id="status"
                name="status"
                value={statusValue}
                onChange={(e) =>
                  setStatusValue(e.target.value as ParticipantStatus)
                }
                size="small"
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="withdrawn">Withdrawn</MenuItem>
                <MenuItem value="disqualified">Disqualified</MenuItem>
              </TextField>
            </div>
            <div className="flex justify-end bg-gray-50 gap-2 px-4 py-2">
              <Button
                variant="outlined"
                color="secondary"
                type="button"
                onClick={toggleStatusModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateStatusSelected(statusValue)}
              >
                Confirm
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
