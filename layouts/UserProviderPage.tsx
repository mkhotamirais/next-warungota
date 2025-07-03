"use client";

import PendingPage from "@/components/PendingPage";
import { useFirebaseStore } from "@/lib/firebaseStore";
import { useAuthListener } from "@/lib/useAuthListener";

export default function UserProviderPage({ children }: { children: React.ReactNode }) {
  const { isMounted } = useFirebaseStore();
  useAuthListener();

  if (!isMounted) return <PendingPage />;

  return <>{children}</>;
}
