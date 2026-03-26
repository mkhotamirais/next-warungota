"use client";

import AsideMenuDesktop from "@/app/(protected)/AsideMenuDesktop";
import EmailVerificationBanner from "@/app/(protected)/EmailVerificationBanner";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { update, status } = useSession();
  const hasUpdated = useRef(false);
  const pathname = usePathname();
  const isCartRoute = pathname === "/user/cart";

  useEffect(() => {
    if (status === "authenticated" && !hasUpdated.current) {
      update({});
      hasUpdated.current = true;
    }
  }, [status, update]);

  return (
    <div className="container py-3">
      <div className="flex items-start">
        {!isCartRoute ? (
          <div className="hidden md:block w-full md:w-1/4 sticky top-16">
            <AsideMenuDesktop />
          </div>
        ) : null}
        <div className={`w-full ${isCartRoute ? "w-full" : "w-full md:w-3/4"}`}>
          <EmailVerificationBanner />
          {children}
        </div>
      </div>
    </div>
  );
}
