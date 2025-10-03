"use client";
import React from "react";

interface TooltipProps {
  message: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute z-99 hidden group-hover:block transition-opacity duration-200 opacity-0 group-hover:opacity-100 bg-gray-800 text-white font-semibold text-sm rounded px-2 py-1 bottom-full left-1/2 transform -translate-x-1/2 mb-1 whitespace-nowrap">
        {message}
      </div>
    </div>
  );
};

