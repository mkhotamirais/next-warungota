"use client";

import PendingPage from "@/components/PendingPage";
import { useUserStore } from "@/lib/hooks/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRouteAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isMounted } = useUserStore();

  useEffect(() => {
    if (isMounted && user) router.replace("/");
  }, [isMounted, user, router]);

  if (!isMounted || user) return <PendingPage />;

  return <>{children}</>;
}
