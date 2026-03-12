"use client";

import { useMobileMenu } from "@/hooks/zustand/useMobileMenu";
import React from "react";

export default function MainProvider({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useMobileMenu();

  const handleClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <main className="min-h-screen" onClick={handleClick}>
      {children}
    </main>
  );
}
