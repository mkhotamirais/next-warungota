"use client";

import PendingPage from "@/components/PendingPage";
import { useFirebaseStore } from "@/lib/firebaseStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRouteAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isMounted } = useFirebaseStore();

  useEffect(() => {
    if (isMounted && user) router.replace("/");
  }, [isMounted, user, router]);

  if (!isMounted || user) return <PendingPage />;

  return <>{children}</>;
}
