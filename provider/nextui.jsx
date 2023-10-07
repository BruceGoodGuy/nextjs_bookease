"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Content from "@/components/Content";

export default function NextUI({ children }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <Header />
        <Content>{children}</Content>
        <Footer />
      </NextThemesProvider>
    </NextUIProvider>
  );
}
