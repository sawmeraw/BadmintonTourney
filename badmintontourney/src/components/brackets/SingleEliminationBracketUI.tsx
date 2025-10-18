"use client";

import { useBrackets } from "@/hooks/useBrackets";
import { createBracket } from "bracketry";
import { useEffect, useMemo, useRef } from "react";
import transformDataForBracketry from "./BracketMapper";
import { ErrorDisplay } from "../utils/ClientError";
import { BracketryData } from "@/lib/types/bracketry";
import BracketNotGenerated from "./BracketNotGenerated";
export interface SingleEliminationBracketUIProps {
  eventId: string;
}
export default function SingleEliminationBracketUI(
  props: SingleEliminationBracketUIProps,
) {
  const { eventId } = props;
  const { data, isLoading, isError } = useBrackets(eventId);
  // console.log(data);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const processedData = useMemo<BracketryData | null>(() => {
    if (!data) return null;
    return transformDataForBracketry(data);
  }, [data]);
  useEffect(() => {
    if (
      wrapperRef.current &&
      processedData &&
      processedData.rounds.length > 0
    ) {
      const wrapper = wrapperRef.current;
      wrapper.innerHTML = "";
      createBracket(processedData, wrapper);
    }
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-md">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay message="Sorry, an error occurred looking for requested resource." />
    );
  }

  if (!processedData || processedData.rounds.length === 0) {
    return <BracketNotGenerated />;
  }

  return <div ref={wrapperRef}></div>;
}
