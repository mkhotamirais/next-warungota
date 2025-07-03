"use client";

import PendingPage from "@/components/PendingPage";
import { useUserStore } from "@/lib/hooks/useUserStore";
import { TUserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteRolesProps {
  children: React.ReactNode;
  authorizedRoles: TUserRole[];
}

export default function ProtectedRouteRoles({ children, authorizedRoles }: ProtectedRouteRolesProps) {
  const router = useRouter();
  const { user, isMounted } = useUserStore();

  const isAuthorized = user && authorizedRoles.includes(user.role as TUserRole);

  useEffect(() => {
    if (isMounted && !isAuthorized) {
      router.replace("/");
    }
  }, [isMounted, isAuthorized, router]);

  if (!isMounted || !isAuthorized) return <PendingPage />;

  return <>{children}</>;
}
