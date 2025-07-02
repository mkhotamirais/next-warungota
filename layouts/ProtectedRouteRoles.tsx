"use client";

import Pending from "@/components/Pending";
import { useFirebaseStore } from "@/lib/firebaseStore";
import { TUserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteRolesProps {
  children: React.ReactNode;
  authorizedRoles: TUserRole[];
}

export default function ProtectedRouteRoles({ children, authorizedRoles }: ProtectedRouteRolesProps) {
  const router = useRouter();
  const { user, isMounted } = useFirebaseStore();

  const isAuthorized = user && authorizedRoles.includes(user.role as TUserRole);

  useEffect(() => {
    if (isMounted && !isAuthorized) {
      router.replace("/");
    }
  }, [isMounted, isAuthorized, router]);

  if (!isMounted || !isAuthorized) return <Pending />;

  return <>{children}</>;
}
