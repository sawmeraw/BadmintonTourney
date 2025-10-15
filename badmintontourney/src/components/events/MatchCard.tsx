import {
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Standard MUI icon import
import { type MatchCardPropType } from "./BracketsView"; // Assuming types are in a file

const getParticipantName = (
    participant:
        | MatchCardPropType["participant1"]
        | MatchCardPropType["participant2"]
) => {
    if (!participant) return "To Be Determined";

    let name = `${participant.player1.first_name} ${
        participant.player1.last_name ?? ""
    }`;

    if (participant.player2) {
        name += ` / ${participant.player2.first_name} ${
            participant.player2.last_name ?? ""
        }`;
    }
    return name;
};

export const MatchCard = ({ match }: { match: MatchCardPropType }) => {
    // FIX: Your type uses `participant_id` inside the participant object.
    // The winner check should use this property.
    const p1IsWinner = match.winner_id === match.participant1?.id;
    const p2IsWinner = match.winner_id === match.participant2?.id;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {match.round_match_number && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        component="div"
                    >
                        Match #{match.round_match_number}
                    </Typography>
                )}

                <Stack spacing={1.5} mt={1}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            variant="body1"
                            fontWeight={p1IsWinner ? "bold" : "normal"}
                            color={
                                p1IsWinner ? "text.primary" : "text.secondary"
                            }
                        >
                            {getParticipantName(match.participant1)}
                        </Typography>
                        {p1IsWinner && (
                            <CheckCircleIcon
                                color="success"
                                sx={{ fontSize: "1.25rem" }}
                            />
                        )}
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            variant="body1"
                            fontWeight={p2IsWinner ? "bold" : "normal"}
                            color={
                                p2IsWinner ? "text.primary" : "text.secondary"
                            }
                        >
                            {getParticipantName(match.participant2)}
                        </Typography>
                        {p2IsWinner && (
                            <CheckCircleIcon
                                color="success"
                                sx={{ fontSize: "1.25rem" }}
                            />
                        )}
                    </Box>
                </Stack>
            </CardContent>

            {match.status === "completed" && match.sets?.length > 0 && (
                <>
                    <Divider />
                    <Box
                        sx={{
                            px: 2,
                            py: 1,
                            bgcolor: "grey.50",
                            textAlign: "right",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace" }}
                        >
                            {match.sets
                                .map(
                                    (set) =>
                                        `${set.participant1_score}-${set.participant2_score}`
                                )
                                .join(" / ")}
                        </Typography>
                    </Box>
                </>
            )}
        </Card>
    );
};
