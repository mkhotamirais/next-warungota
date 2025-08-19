"use client";

import React from "react";
import Link from "next/link";
import { menu as m } from "@/lib/content";
import AuthBtn from "./AuthBtn";
import Sidebar, { SidebarClose } from "@/components/ui/Sidebar";
import { FaBars } from "react-icons/fa6";
import Button from "../ui/Button";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Logo from "../Logo";

const trigger = (
  <div className="p-2 border border-gray-300 rounded">
    <FaBars className="text-lg" />
  </div>
);

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <Logo />
        {/* nav desktop */}
        <div className="hidden md:flex">
          <div className="flex gap-1">
            {m.mainMenu.map((item) => (
              <Link
                key={item.label}
                href={item.url}
                className={clsx("py-2 px-3 hover:bg-gray-100 text-sm text-gray-600 rounded", {
                  "bg-gray-200": pathname === item.url,
                })}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-4">
              <AuthBtn />
            </div>
          </div>
        </div>
        {/* nav mobile */}
        <Sidebar trigger={trigger} className="md:hidden">
          <div className="flex flex-col gap-1 mt-4">
            {m.mainMenu.map((item) => (
              <SidebarClose key={item.label} asChild>
                <Button
                  as={Link}
                  href={item.url}
                  variant="gray"
                  className={`${pathname === item.url ? "bg-gray-200" : ""}`}
                >
                  {item.label}
                </Button>
              </SidebarClose>
            ))}
            <SidebarClose>
              <AuthBtn />
            </SidebarClose>
          </div>
        </Sidebar>
      </div>
    </header>
  );
}
