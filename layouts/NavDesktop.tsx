"use client";

import React from "react";
import c from "@/lib/content.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFirebaseStore } from "@/lib/firebaseStore";
import Sheet2 from "@/components/Sheet2";
import { User } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function NavDesktop() {
  const { user, setUser } = useFirebaseStore();
  const router = useRouter();

  const onLogout = () => {
    signOut(auth);
    setUser(null);
    router.push("/login");
  };
  return (
    <nav className="hidden sm:flex">
      {c.main_menu.map((item, i) => (
        <Link href={item.url} key={i}>
          <Button variant={"ghost"}>{item.label}</Button>
        </Link>
      ))}
      {user ? (
        <Sheet2 title={"halo"} triggerIcon={<User />}>
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
    </nav>
  );
}
