"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute={"class"} defaultTheme={"dark"}>
        <ClerkProvider>
          <div className={"w-full min-h-screen text-foreground bg-background"}>{children}</div>
        </ClerkProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default Providers;
