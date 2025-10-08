"use client";

import toast from "react-hot-toast";
import { useParticipantContext } from "../_context/ParticipantManagerContext";
import Button from "@mui/material/Button";

export const BulkActionBar = () => {
	const {
		selectedIds,
		participants,
		disableBulkUnseed,
		clearSelection,
		removeSeedFromSelected,
		deleteSelected,
		toggleStatusModal,
		swapSeedsSelected,
	} = useParticipantContext();

	const handleSwapSeedButton = () => {
		if (selectedIds.length !== 2) {
			toast.error("Swap is allowed only between 2 participants", {
				duration: 3000,
			});
			return;
		}

		const isAnySeedNull = selectedIds.some((id) => {
			const participant = participants.find((p) => p.id === id);
			return !participant || participant.seed == null;
		});

		if (isAnySeedNull) {
			toast.error(
				"Cannot swap seeds: one or more participants have null seed values",
				{
					duration: 3000,
				}
			);
			return;
		}

		swapSeedsSelected();
	};

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
					variant="outlined"
					color="warning"
					onClick={handleSwapSeedButton}
					disabled={selectedIds.length !== 2}
				>
					Swap Seed
				</Button>

				<Button
					variant="contained"
					color="secondary"
					onClick={toggleStatusModal}
				>
					Update Status
				</Button>

				<Button
					variant="contained"
					color="warning"
					onClick={removeSeedFromSelected}
					disabled={disableBulkUnseed}
				>
					Remove Seed
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={deleteSelected}
				>
					Delete
				</Button>
			</div>
		</div>
	);
};
