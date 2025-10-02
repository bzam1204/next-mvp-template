'use client';

import { useState } from "react";
import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/components/theme/theme-provider";

const defaultOptions = {
    queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    },
    mutations: {
        retry: 0,
    },
};

export function Providers({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient({ defaultOptions }));

    return (
        <ThemeProvider>
            <QueryClientProvider client={client}>{children}</QueryClientProvider>
        </ThemeProvider>
    );
}
