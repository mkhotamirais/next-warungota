"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { update, status } = useSession();
  const hasUpdated = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && !hasUpdated.current) {
      update({});
      hasUpdated.current = true;
    }
  }, [status, update]);

  return children;
}
