"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="drafting"
            themes={["drafting", "blueprint", "vellum"]}
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}
