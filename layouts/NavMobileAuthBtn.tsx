import React from "react";
import UserProvider from "./UserProvider";
import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/hooks/useUserStore";

export default function NavMobileAuthBtn() {
  const { user } = useUserStore();

  return (
    <UserProvider>
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
    </UserProvider>
  );
}
