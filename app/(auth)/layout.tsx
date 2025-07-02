"use client";

import Pending from "@/components/Pending";
import { useFirebaseStore } from "@/lib/firebaseStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isMounted } = useFirebaseStore();

  useEffect(() => {
    if (isMounted && user) {
      router.replace("/dashboard");
    }
  }, [isMounted, user, router]);
  if (!isMounted || user) return <Pending />;

  return <>{children}</>;
}
