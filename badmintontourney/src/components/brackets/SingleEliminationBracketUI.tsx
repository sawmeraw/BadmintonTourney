"use client";

import { useBrackets } from "@/hooks/useBrackets";
import { createBracket } from "bracketry";
import { useEffect, useRef } from "react";

export interface SingleEliminationBracketUIProps {
    eventId: string;
}
export default function SingleEliminationBracketUI(
    props: SingleEliminationBracketUIProps
) {
    const { eventId } = props;
    const { data, isLoading, isError } = useBrackets(eventId);
    console.log(data);
    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
            const data = {
                rounds: [
                    {
                        name: "1st round",
                    },
                ],
                matches: [
                    {
                        roundIndex: 0,
                        order: 0,
                        sides: [
                            {
                                contestantId: "163911",
                                scores: [
                                    {
                                        mainScore: "7",
                                        isWinner: true,
                                    },
                                    {
                                        mainScore: "6",
                                        isWinner: true,
                                    },
                                    {
                                        mainScore: "6",
                                        isWinner: true,
                                    },
                                ],
                                isWinner: true,
                            },
                            {
                                contestantId: "163806",
                                scores: [
                                    {
                                        mainScore: "5",
                                    },
                                    {
                                        mainScore: "2",
                                    },
                                    {
                                        mainScore: "2",
                                    },
                                ],
                            },
                        ],
                    },
                ],
                contestants: {
                    163806: {
                        entryStatus: "4",
                        players: [
                            {
                                title: "D. Medvedev",
                                nationality: "RU",
                            },
                        ],
                    },
                    163911: {
                        entryStatus: "1",
                        players: [
                            {
                                title: "N. Djokovic",
                                nationality: "RS",
                            },
                        ],
                    },
                },
            };
            createBracket(data, wrapper);
        }
    }, []);
    return <div ref={wrapperRef}></div>;
}
