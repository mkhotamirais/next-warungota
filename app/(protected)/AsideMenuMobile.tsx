"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menu as m } from "@/lib/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AsideMenuMobile() {
  const { data: session } = useSession();
  const user = session?.user;

  const menu = user?.role === "ADMIN" ? m.admin : m.user;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon-sm"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-64 px-2">
        <SheetHeader>
          <SheetTitle>Admin Menu</SheetTitle>
          <SheetDescription className="sr-only">Admin menu description</SheetDescription>
        </SheetHeader>
        <div>
          {menu.map((item, i) => (
            <SheetClose asChild key={i}>
              <Button variant={"ghost"} asChild key={i} className="block mb-1">
                <Link href={item.url} className="">
                  {item.label}
                </Link>
              </Button>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
