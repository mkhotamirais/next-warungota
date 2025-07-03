"use client";

import Pending from "@/components/Pending";
import { useAuthListener } from "@/lib/hooks/useAuthListener";
import { useUserStore } from "@/lib/hooks/useUserStore";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { isMounted } = useUserStore();

  useAuthListener();

  if (!isMounted) return <Pending />;

  return <>{children}</>;
}
