"use client";

import Button from "@mui/material/Button";
import { EventsList, NoEvents } from "@/components/tournaments/AdminEventList";
import {
  createTournamentAction,
  TournamentFormState,
  updateTournamentAction,
} from "@/lib/actions/TournamentActions";
import { Tournament } from "@/supabase/queryTypes";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { TextField, Checkbox, FormControlLabel, MenuItem } from "@mui/material";

type LocationFormOption = { id: string; name: string };
type EventListItem = { id: string; name: string | null };
interface TournamentFormProps {
  initialData?: Tournament | null;
  locations: LocationFormOption[];
  events?: EventListItem[];
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Tournament"}
    </Button>
  );
}

export default function TournamentEditForm({
  initialData,
  locations,
  events,
}: TournamentFormProps) {
  const isEditing = !!initialData;
  const initialState: TournamentFormState = { message: "", success: false };

  const actionToCall = isEditing
    ? updateTournamentAction.bind(null, initialData.id)
    : createTournamentAction;
  const [state, formAction] = useActionState(actionToCall, initialState);

  const hasEvents = events && events.length > 0;

  return (
    <form action={formAction}>
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
            <h2 className="text-lg font-semibold leading-7 text-gray-900">
              Tournament Details
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Basic information for your tournament.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <TextField
                  type="text"
                  name="name"
                  id="name"
                  label="Tournament Name"
                  variant="outlined"
                  defaultValue={initialData?.name}
                  fullWidth
                  required
                />
                {state.errors?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Start Date"
                  id="start_date"
                  name="start_date"
                  type="date"
                  fullWidth
                  defaultValue={
                    initialData?.start_date
                      ? new Date(initialData.start_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  error={!!state.errors?.start_date}
                  helperText={state.errors?.start_date?.[0]}
                  required
                />

                <TextField
                  label="End Date"
                  id="end_date"
                  name="end_date"
                  type="date"
                  fullWidth
                  defaultValue={
                    initialData?.end_date
                      ? new Date(initialData.end_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  error={!!state.errors?.end_date}
                  helperText={state.errors?.end_date?.[0]}
                  required
                />
              </div>

              <div>
                <TextField
                  label="Description"
                  id="description"
                  name="description"
                  variant="outlined"
                  defaultValue={initialData?.description || ""}
                  fullWidth
                  minRows={3}
                  multiline
                  maxRows={10}
                ></TextField>
              </div>
              <div>
                <TextField
                  label="Banner Image URL"
                  id="banner_url"
                  name="banner_url"
                  type="url"
                  defaultValue={initialData?.banner_url || ""}
                  fullWidth
                  variant="outlined"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">
              Logistics & Information
            </h2>
            <div className="mt-6 flex flex-col gap-6">
              <TextField
                label="Shuttlecock Info"
                id="shuttle_info"
                name="shuttle_info"
                type="text"
                defaultValue={initialData?.shuttle_info || ""}
                fullWidth
                variant="outlined"
                placeholder="e.g., Yonex Aerosensa 30"
              />

              <TextField
                label="Food & Refreshments"
                id="food_info"
                name="food_info"
                defaultValue={initialData?.food_info || ""}
                fullWidth
                variant="outlined"
                multiline
                minRows={2}
              />

              <TextField
                label="Parking Information"
                id="parking_info"
                name="parking_info"
                defaultValue={initialData?.parking_info || ""}
                fullWidth
                variant="outlined"
                multiline
                minRows={2}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">
              Settings
            </h2>
            <div>
              <TextField
                select
                label="Location"
                id="location_id"
                name="location_id"
                defaultValue={initialData?.location_id || ""}
                fullWidth
                variant="outlined"
                error={!!state.errors?.location_id}
              >
                <MenuItem value="">Select a location</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </TextField>

              {state.errors?.location_id && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.location_id}
                </p>
              )}
            </div>
            <div>
              <TextField
                select
                label="Status"
                id="status"
                name="status"
                defaultValue={initialData?.status || "upcoming"}
                fullWidth
                variant="outlined"
                error={!!state.errors?.status}
              >
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </div>
            <div className="relative flex items-start">
              <FormControlLabel
                control={
                  <Checkbox
                    id="is_registration_closed"
                    name="is_registration_closed"
                    defaultChecked={
                      initialData?.is_registration_closed || false
                    }
                    sx={{
                      color: "emerald.main",
                      "&.Mui-checked": {
                        color: "emerald.main",
                      },
                    }}
                  />
                }
                label="Close Registration"
              />
            </div>
            <div className="border-t border-gray-200 pt-6">
              <SubmitButton isEditing={isEditing} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">
              Configure Events
            </h2>
            {hasEvents ? (
              <EventsList
                tournamentId={initialData?.id}
                events={events}
              ></EventsList>
            ) : (
              <NoEvents tournamentId={initialData?.id}></NoEvents>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
