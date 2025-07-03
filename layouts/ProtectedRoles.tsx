"use client";

import { useUserStore } from "@/lib/hooks/useUserStore";
import { TUserRole } from "@/lib/types";
import React from "react";

interface ProtectedRolesProps {
  children: React.ReactNode;
  roles: TUserRole[];
}

export default function ProtectedRoles({ children, roles }: ProtectedRolesProps) {
  const { user } = useUserStore();
  if (user && roles.includes(user?.role as TUserRole)) return <>{children}</>;
  return null;
}
