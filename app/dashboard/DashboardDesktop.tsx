"use client";

import Button from "@/components/ui/Button";
import React from "react";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function DashboardDesktop() {
  const pathname = usePathname();

  return (
    <>
      {m.dashboardMenu.map((item, i) => (
        <Button
          as={Link}
          href={item.url}
          variant="gray"
          key={i}
          className={`${pathname === item.url ? "bg-gray-200" : ""} w-full mb-1`}
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
