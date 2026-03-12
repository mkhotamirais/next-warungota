"use client";

import { useMobileMenu } from "@/hooks/zustand/useMobileMenu";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const { open, setOpen } = useMobileMenu();

  React.useEffect(() => setMounted(true), []);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [],
  );

  const handleClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <div onClick={handleClick}>{children}</div>
    </QueryClientProvider>
  );
}
