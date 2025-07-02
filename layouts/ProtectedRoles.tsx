"use client";

import { useFirebaseStore } from "@/lib/firebaseStore";
import { TUserRole } from "@/lib/types";
import React from "react";

interface ProtectedRolesProps {
  children: React.ReactNode;
  roles: TUserRole[];
}

export default function ProtectedRoles({ children, roles }: ProtectedRolesProps) {
  const { user } = useFirebaseStore();
  if (user && roles.includes(user?.role as TUserRole)) return <>{children}</>;
  return null;
}
