"use client";

import Sheet2 from "@/components/Sheet2";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import c from "@/lib/content.json";
import UserProvider from "./UserProvider";
import { useUserStore } from "@/lib/hooks/useUserStore";

export default function NavUser() {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const onLogout = () => {
    signOut(auth);
    setUser(null);
    router.push("/login");
  };

  return (
    <UserProvider>
      {user ? (
        <Sheet2 title={user.name || "USER"} menu={c.user_menu} triggerIcon={<User />}>
          <SheetClose asChild>
            <Button variant={"default"} onClick={onLogout}>
              Logout
            </Button>
          </SheetClose>
        </Sheet2>
      ) : (
        <Link href="/login">
          <Button variant={"default"} className="ml-4">
            Login
          </Button>
        </Link>
      )}
    </UserProvider>
  );
}
