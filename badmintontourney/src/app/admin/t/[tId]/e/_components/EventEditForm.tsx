"use client";

// import { Button } from "@/components/utils/Button";
import Button from "@mui/material/Button";
import { Event } from "@/supabase/queryTypes";
import { startTransition, useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  createEventAction,
  EventFormState,
  updateEventAction,
} from "@/lib/actions/EventActions";
import EventConfirmationModal from "@/components/events/EventConfirmationModal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

type EventTypeFormOption = { id: string; name: string };
type TemplateFormOption = { id: string; name: string };
interface EventFormProps {
  initialData?: (Event & { tournaments: { name: string } }) | null;
  eventTypes: EventTypeFormOption[];
  templates: TemplateFormOption[];
  tournamentId: string;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="contained"
      type="submit"
      color="primary"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Event"}
    </Button>
  );
}

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
      {value}
    </dd>
  </div>
);

export default function EventEditForm({
  initialData,
  eventTypes,
  templates,
  tournamentId,
}: EventFormProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!initialData;
  const initialState: EventFormState = { message: "", success: false };

  const actionToCall = isEditing
    ? updateEventAction.bind(
        null,
        initialData.id,
        initialData.finalised_for_matches || false
      )
    : createEventAction.bind(null, tournamentId);
  const [state, formAction] = useActionState(actionToCall, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("finalised_for_matches")) {
      setIsModalOpen(true);
    } else {
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const handleConfirmFinalise = () => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <form
        action={formAction}
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative"
      >
        {state.message && (
          <div
            className={`mb-6 flex items-center gap-x-3 rounded-md p-4 text-sm ${
              state.success
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {state.success ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <InformationCircleIcon className="h-5 w-5" />
            )}
            <p>{state.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Event Details
              </h2>
              <div className="mt-6 space-y-6">
                <div>
                  <input
                    type="hidden"
                    name="tournament_id"
                    id="tournament_id"
                    defaultValue={tournamentId}
                  />
                </div>
                <div>
                  <TextField
                    label="Event Name"
                    id="name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.name || ""}
                    size="small"
                    error={!!state.errors?.name}
                  />

                  {state.errors?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.name[0]}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    label="Description"
                    id="description"
                    name="description"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.description || ""}
                    multiline
                    minRows={4}
                    size="small"
                    error={!!state.errors?.description}
                  />

                  {state.errors?.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.description[0]}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    label="Notes"
                    id="notes"
                    name="notes"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.notes || ""}
                    multiline
                    minRows={3}
                    size="small"
                    error={!!state.errors?.notes}
                  />
                  {state.errors?.notes && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.notes[0]}
                    </p>
                  )}
                </div>

                <div>
                  <TextField
                    label="Sponsor Name"
                    id="sponsor_name"
                    name="sponsor_name"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.sponsor_name || ""}
                    size="small"
                    error={!!state.errors?.sponsor_name}
                  />
                  {state.errors?.sponsor_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.sponsor_name[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Prizes & Fees
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <TextField
                    label="Entry Fee ($)"
                    id="entry_fee"
                    name="entry_fee"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.entry_fee || 0}
                    size="small"
                    inputProps={{ step: "0.01" }}
                    error={!!state.errors?.entry_fee}
                  />
                  {state.errors?.entry_fee && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.entry_fee[0]}
                    </p>
                  )}
                </div>

                <div>
                  <TextField
                    label="First Prize ($)"
                    id="first_prize_money"
                    name="first_prize_money"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.first_prize_money || 0}
                    size="small"
                    inputProps={{ step: "0.01" }}
                    error={!!state.errors?.first_prize_money}
                  />
                  {state.errors?.first_prize_money && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.first_prize_money[0]}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    label="Second Prize ($)"
                    id="second_prize_money"
                    name="second_prize_money"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.second_prize_money || 0}
                    size="small"
                    error={!!state.errors?.second_prize_money}
                  />
                  {state.errors?.second_prize_money && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.second_prize_money[0]}
                    </p>
                  )}
                </div>

                <div>
                  <TextField
                    label="Third Prize ($)"
                    id="third_prize_money"
                    name="third_prize_money"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.third_prize_money || 0}
                    size="small"
                    error={!!state.errors?.third_prize_money}
                  />
                  {state.errors?.third_prize_money && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.third_prize_money[0]}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <TextField
                    label="Prize Details"
                    id="prize_details"
                    name="prize_details"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.prize_details || ""}
                    multiline
                    minRows={3}
                    size="small"
                    error={!!state.errors?.prize_details}
                  />
                  {state.errors?.prize_details && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.prize_details[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Stats</h2>
              <dl className="mt-4 grid grid-cols-2 gap-5">
                <StatCard
                  label="Current Entries"
                  value={initialData?.current_entries || 0}
                />
                <StatCard
                  label="Max Participants"
                  value={initialData?.max_participants || "N/A"}
                />
              </dl>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Configuration
              </h2>
              <p
                className={
                  initialData?.finalised_for_matches
                    ? `text-red-500 text-xs`
                    : `text-blue-500 text-xs`
                }
              >
                {initialData?.finalised_for_matches
                  ? "Cannot update configuration after creating matches."
                  : "Configuration cannot be updated after finalizing."}
              </p>
              <div className="mt-6 space-y-6">
                <div>
                  <TextField
                    select
                    label="Event Type"
                    id="event_type_id"
                    name="event_type_id"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.event_type_id || ""}
                    size="small"
                    disabled={initialData?.finalised_for_matches || false}
                    error={!!state.errors?.event_type_id}
                  >
                    <MenuItem value="">Select type...</MenuItem>
                    {eventTypes.map((et) => (
                      <MenuItem key={et.id} value={et.id}>
                        {et.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {state.errors?.event_type_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.event_type_id[0]}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    label="Max Participants"
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.max_participants || 0}
                    size="small"
                    disabled={initialData?.finalised_for_matches || false}
                    error={!!state.errors?.max_participants}
                  />
                  {state.errors?.max_participants && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.max_participants[0]}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    select
                    label="Tournament Format"
                    id="template_id"
                    name="template_id"
                    variant="outlined"
                    fullWidth
                    defaultValue={initialData?.template_id || ""}
                    size="small"
                    disabled={initialData?.finalised_for_matches || false}
                    error={!!state.errors?.template_id}
                  >
                    <MenuItem value="">Select format...</MenuItem>
                    {templates.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {state.errors?.template_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.errors.template_id[0]}
                    </p>
                  )}

                  {isEditing && (
                    <p className="mt-1 text-xs text-gray-500">
                      Format cannot be changed after creation.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="has_third_place_match"
                        name="has_third_place_match"
                        defaultChecked={
                          initialData?.has_third_place_match || false
                        }
                        disabled={initialData?.finalised_for_matches || false}
                        sx={{
                          p: 0.5,
                          color: "emerald.main",
                          "&.Mui-checked": {
                            color: "emerald.main",
                          },
                        }}
                      />
                    }
                    label="Include 3rd Place Match"
                    sx={{
                      ml: 1.5,
                      "& .MuiFormControlLabel-label": {
                        fontWeight: 500,
                        color: initialData?.finalised_for_matches
                          ? "#9ca3af"
                          : "#111827",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="is_featured"
                        name="is_featured"
                        defaultChecked={initialData?.is_featured || false}
                        disabled={initialData?.finalised_for_matches || false}
                        sx={{
                          p: 0.5,
                          "&.Mui-checked": {
                            color: "#059669",
                          },
                        }}
                      />
                    }
                    label="Show as Featured"
                    sx={{
                      ml: 1.5,
                      "& .MuiFormControlLabel-label": {
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: initialData?.finalised_for_matches
                          ? "#9ca3af"
                          : "#111827",
                      },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="finalised_for_matches"
                        name="finalised_for_matches"
                        defaultChecked={
                          initialData?.finalised_for_matches || false
                        }
                        disabled={initialData?.finalised_for_matches || false}
                        sx={{
                          p: 0.5,
                          "&.Mui-checked": {
                            color: "#059669", // emerald-600
                          },
                        }}
                      />
                    }
                    label="Finalize & Create Matches"
                    sx={{
                      ml: 1.5,
                      "& .MuiFormControlLabel-label": {
                        fontWeight: 500,
                        fontSize: "0.875rem", // text-sm
                        color: initialData?.finalised_for_matches
                          ? "#9ca3af"
                          : "#111827", // gray-400 or gray-900
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <SubmitButton isEditing={isEditing} />
            </div>
          </div>
        </div>
      </form>
      <EventConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmFinalise}
        currentEntries={initialData?.current_entries || 0}
        maxParticipants={initialData?.max_participants || 0}
      ></EventConfirmationModal>
    </>
  );
}
