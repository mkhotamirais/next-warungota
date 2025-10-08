"use client";

import { useEffect, useState } from "react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsmounted] = useState(false);

  useEffect(() => {
    setIsmounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <>{children}</>;
}
