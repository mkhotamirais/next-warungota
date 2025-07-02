import Logo from "@/components/Logo";
import Sheet2 from "@/components/Sheet2";
import React from "react";
import c from "@/lib/content.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

export default function NavMobile() {
  return (
    <div className="flex sm:hidden">
      <Sheet2 title={<Logo />} menu={c.main_menu}>
        <SheetClose asChild>
          <Link href="/login">
            <Button variant={"default"} className="w-full">
              Login
            </Button>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link href="/register">
            <Button variant={"outline"} className="w-full">
              Register
            </Button>
          </Link>
        </SheetClose>
      </Sheet2>
    </div>
  );
}
