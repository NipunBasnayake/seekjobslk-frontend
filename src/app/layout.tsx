"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
