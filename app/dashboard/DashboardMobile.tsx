"use client";

import Sidebar, { SidebarClose } from "@/components/ui/Sidebar";
import { FaBars } from "react-icons/fa6";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";

// Fungsi helper untuk mengolah path menjadi judul yang rapi
const formatTitle = (path: string) => {
  const pathSegments = path.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  if (!lastSegment || lastSegment === "dashboard") {
    return "Dashboard";
  }

  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
};

const trigger = (
  <div className="p-2 border border-gray-300 rounded">
    <FaBars className="text-lg" />
  </div>
);

export default function DashboardMobile() {
  // Hook usePathname hanya bisa digunakan di Client Component
  const pathname = usePathname();
  const dynamicTitle = formatTitle(pathname);

  return (
    <div className="flex items-center gap-2">
      {/* Sidebar adalah Client Component, ditempatkan di sini */}
      <Sidebar trigger={trigger} side="left" classSide="top-16" className="sm:hidden">
        <div className="">
          {m.dashboardMenu.map((item, i) => (
            <SidebarClose key={i} asChild>
              <Button as={Link} href={item.url} variant="gray" className="w-full mb-1">
                {item.label}
              </Button>
            </SidebarClose>
          ))}
          <SidebarClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => signOut({ redirectTo: "/signin" })}
              className="w-full mt-2"
            >
              Sign Out
            </Button>
          </SidebarClose>
        </div>
      </Sidebar>

      {/* Judul dinamis yang dibuat dari pathname */}
      <h1 className="h1">{dynamicTitle}</h1>
    </div>
  );
}
