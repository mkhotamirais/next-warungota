"use client";

import Logo from "@/components/Logo";
import Sheet2 from "@/components/Sheet2";
import React from "react";
import c from "@/lib/content.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useFirebaseStore } from "@/lib/firebaseStore";

export default function NavMobile() {
  const { user } = useFirebaseStore();

  return (
    <div className="flex sm:hidden">
      <Sheet2 title={<Logo />} menu={c.main_menu}>
        {!user ? (
          <>
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
          </>
        ) : null}
      </Sheet2>
    </div>
  );
}
