"use client";

import { useBrackets } from "@/hooks/useBrackets";
import { createBracket } from "bracketry";
import { useEffect, useMemo, useRef } from "react";
import transformDataForBracketry from "./BracketMapper";
import { ErrorDisplay } from "../utils/ClientError";
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

  const processedData = useMemo(() => {
    if (!data) return [];
    return transformDataForBracketry(data);
  }, [data]);
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper && processedData) {
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
  return <div ref={wrapperRef}></div>;
}
