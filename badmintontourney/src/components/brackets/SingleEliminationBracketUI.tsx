"use client";

import { useBrackets } from "@/hooks/useBrackets";
import { createBracket } from "bracketry";
import { useEffect, useMemo, useRef } from "react";
import transformDataForBracketry from "./BracketMapper";

export interface SingleEliminationBracketUIProps {
    eventId: string;
}
export default function SingleEliminationBracketUI(
    props: SingleEliminationBracketUIProps
) {
    const { eventId } = props;
    const { data, isLoading, isError } = useBrackets(eventId);
    // console.log(data);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const processedData = useMemo(() => {
        if (!data) return [];
        return transformDataForBracketry(data);
    }, [data]);
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (wrapper && processedData) {
            createBracket(processedData, wrapper);
        }
    }, []);
    return <div ref={wrapperRef}></div>;
}
