"use client";
import dynamic from "next/dynamic";

const SingleEliminationBracketUI = dynamic(
    () => import("@/components/brackets/SingleEliminationBracketUI"),
    {
        ssr: false,
    }
);

export interface BracketUIProps {
    eventId: string;
}

export default function BracketUI(props: BracketUIProps) {
    return <SingleEliminationBracketUI eventId={props.eventId} />;
}
