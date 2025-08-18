"use client";

import Sidebar, { SidebarClose } from "@/components/ui/Sidebar";
import { FaBars } from "react-icons/fa6";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Button from "@/components/ui/Button";
import { signOut, useSession } from "next-auth/react";

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
  const pathname = usePathname();
  const dynamicTitle = formatTitle(pathname);
  const { data: session } = useSession();

  let myMenu = m.userMenu;
  if (session?.user?.role === "admin") {
    myMenu = [...m.editorMenu, ...m.adminMenu];
  } else if (session?.user?.role === "editor") {
    myMenu = [...m.editorMenu];
  }

  return (
    <div className="flex items-center gap-2">
      <Sidebar trigger={trigger} side="left" classSide="top-16" className="sm:hidden">
        <div className="">
          {myMenu.map((item, i) => (
            <SidebarClose key={i} asChild>
              <Button
                as={Link}
                href={item.url}
                variant="gray"
                className={`${pathname === item.url ? "bg-gray-200" : ""} w-full mb-1`}
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

      <h1 className="h1">{dynamicTitle}</h1>
    </div>
  );
}
