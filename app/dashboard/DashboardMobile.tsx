"use client";

import Sidebar, { SidebarClose } from "@/components/ui/Sidebar";
import { FaBars } from "react-icons/fa6";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Button from "@/components/ui/Button";
import { signOut, useSession } from "next-auth/react";
import RefreshData from "./RefreshData";

// Fungsi helper untuk mengolah path menjadi judul yang rapi
const formatTitle = (path: string) => {
  const pathSegments = path.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Kasus: '/dashboard'
  if (!lastSegment || lastSegment === "dashboard") {
    return "Dashboard";
  }

  // Jika ada dua atau lebih segmen dan segmen kedua dari belakang diawali 'edit'
  if (pathSegments.length >= 2 && pathSegments[pathSegments.length - 2].startsWith("edit")) {
    const titleSegment = pathSegments[pathSegments.length - 2];
    const formattedTitle = titleSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formattedTitle;
  }

  // Jika ada dua atau lebih segmen dan segmen kedua darik belakan diawali 'page'
  if (pathSegments.length >= 2 && pathSegments[pathSegments.length - 2].startsWith("page")) {
    const titleSegment = pathSegments[pathSegments.length - 3];
    const page = pathSegments[pathSegments.length - 1];
    const formattedTitle = `${titleSegment} Page ${page}`;
    return formattedTitle;
  }

  // Kasus lainnya (page statis atau page dinamis non-edit)
  const formattedTitle = lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedTitle;
};

const trigger = (
  <div className="p-2 border border-gray-300 rounded">
    <FaBars className="text-lg" />
  </div>
);

export default function DashboardMobile() {
  const pathname = usePathname();
  const dynamicTitle = formatTitle(pathname);
  const { data: session } = useSession();

  let myMenu = m.allRoleMenu;
  if (session?.user?.role === "USER") {
    myMenu = [...m.allRoleMenu, ...m.userMenu];
  } else if (session?.user?.role === "ADMIN") {
    myMenu = [...m.allRoleMenu, ...m.adminMenu];
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Sidebar trigger={trigger} side="left" classSide="top-16" className="sm:hidden">
        <div className="">
          {myMenu.map((item, i) => (
            <SidebarClose key={i} asChild>
              <Button
                as={Link}
                href={item.url}
                variant="gray"
                className={`${pathname === item.url ? "bg-gray-200" : ""} justify-start w-full mb-1`}
              >
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

      <div className="flex justify-between items-center w-full">
        <h1 className="h1">{dynamicTitle}</h1>
        <RefreshData />
      </div>
    </div>
  );
}
