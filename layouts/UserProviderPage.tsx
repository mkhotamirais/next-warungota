"use client";

import PendingPage from "@/components/PendingPage";
import { useAuthListener } from "@/lib/hooks/useAuthListener";
import { useUserStore } from "@/lib/hooks/useUserStore";

export default function UserProviderPage({ children }: { children: React.ReactNode }) {
  const { isMounted } = useUserStore();
  useAuthListener();

  if (!isMounted) return <PendingPage />;

  return <>{children}</>;
}
