"use client";

import { useMobileMenu } from "@/hooks/zustand/useMobileMenu";
import React from "react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const { open, setOpen } = useMobileMenu();

  React.useEffect(() => setMounted(true), []);

  const handleClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  if (!mounted) return null;

  return <div onClick={handleClick}>{children}</div>;
}
