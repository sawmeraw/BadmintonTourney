"use client";

// import { Button } from '@/components/utils/Button';
import { useParticipantContext } from "../_context/ParticipantManagerContext";
import Button from "@mui/material/Button";

export const BulkActionBar = () => {
  const {
    selectedIds,
    disableBulkUnseed,
    clearSelection,
    removeSeedFromSelected,
    deleteSelected,
    updateStatusSelected,
    toggleStatusModal,
  } = useParticipantContext();

  return (
    <div className="absolute top-0 left-2 right-0 flex h-12 items-center z-50 space-x-3 pr-4 bg-gray-50 sm:left-16">
      <p className="text-sm font-medium">{selectedIds.length} selected</p>
      <Button
        color="secondary"
        variant="text"
        sx={{
          bgcolor: "#d3d7de",
          color: "#000000",
          px: 2,
          py: 0.5,
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            bgcolor: "#e5e7eb",
          },
        }}
        onClick={clearSelection}
      >
        Clear selection
      </Button>
      <div className="flex-grow" />
      <div className="flex gap-2">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => toggleStatusModal()}
        >
          Update Status
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={removeSeedFromSelected}
        >
          Remove Seed
        </Button>
        <Button variant="contained" color="error" onClick={deleteSelected}>
          Delete
        </Button>
      </div>
    </div>
  );
};
