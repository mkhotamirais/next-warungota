"use client";

import Button from "@/components/ui/Button";
import React from "react";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import MenuDashboardFallback from "@/components/fallbacks/MenuDashboardFallback";

export default function DashboardDesktop() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  let myMenu = m.allRoleMenu;
  if (session?.user?.role === "USER") {
    myMenu = [...m.allRoleMenu, ...m.userMenu];
  } else if (session?.user?.role === "ADMIN") {
    myMenu = [...m.allRoleMenu, ...m.adminMenu];
  }

  if (status === "loading") return <MenuDashboardFallback />;

  return (
    <>
      {myMenu.map((item, i) => (
        <Button
          as={Link}
          href={item.url}
          variant="gray"
          key={i}
          className={`${pathname === item.url ? "bg-gray-200" : ""} justify-start w-full mb-1`}
        >
          {item.label}
        </Button>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => signOut({ redirectTo: "/signin" })}
        className="w-full mt-2"
      >
        Sign Out
      </Button>
    </>
  );
}
