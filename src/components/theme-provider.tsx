"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Suppress the React 19 false-positive "script tag" and browser-extension warnings in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const isSuppressedWarning = args.some((arg) => {
      if (typeof arg !== "string") return false;
      return (
        arg.includes("Encountered a script tag while rendering React component") ||
        arg.includes("fdprocessedid") ||
        arg.includes("hydration-mismatch") ||
        arg.includes("hydrated but some attributes") ||
        arg.includes("Extra attributes from the server")
      );
    });

    if (isSuppressedWarning) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
