"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { update, status } = useSession();
  const hasUpdated = useRef(false);

  useEffect(() => {
    // Jalankan hanya jika status sudah 'authenticated'
    // dan hanya satu kali per hard reload (menggunakan useRef)
    if (status === "authenticated" && !hasUpdated.current) {
      update({});
      hasUpdated.current = true;
      console.log("Session updated after hard reload");
    }
  }, [status, update]);

  return children;
}
