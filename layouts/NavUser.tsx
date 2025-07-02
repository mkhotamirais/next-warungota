"use client";

import Sheet2 from "@/components/Sheet2";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { auth } from "@/lib/firebase";
import { useFirebaseStore } from "@/lib/firebaseStore";
import { signOut } from "firebase/auth";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import c from "@/lib/content.json";

export default function NavUser() {
  const { user, setUser } = useFirebaseStore();
  const router = useRouter();

  const onLogout = () => {
    signOut(auth);
    setUser(null);
    router.push("/login");
  };

  return (
    <div>
      {user ? (
        <Sheet2 title={user.displayName || "USER"} menu={c.user_menu} triggerIcon={<User />}>
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
    </div>
  );
}
