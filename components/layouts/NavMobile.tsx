"use client";

import Button from "../ui/Button";
import Sidebar, { SidebarClose } from "../ui/Sidebar";
import { FaBars } from "react-icons/fa6";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthBtn from "./AuthBtn";

const trigger = (
  <div className="p-2 border border-gray-300 rounded">
    <FaBars className="text-lg" />
  </div>
);

export default function NavMobile() {
  const pathname = usePathname();
  return (
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
  );
}
