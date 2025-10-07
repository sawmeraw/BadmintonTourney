'use client';

import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { theme } from "./theme";

export function ReactQueryProvider({children}: {children : ReactNode}){
    const [queryClient] = useState(()=> new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    
}

export function ThemeRegistry({children}:{children: React.ReactNode}){
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}

