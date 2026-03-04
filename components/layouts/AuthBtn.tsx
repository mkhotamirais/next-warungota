"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthBtn() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  if (status === "loading") return null;

  return (
    <div>
      {session && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="user initial" size={"icon-lg"} className="rounded-full">
              {initial}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button type="button" asChild>
          <Link href="/login">
            Login
            <LogIn />
          </Link>
        </Button>
      )}
    </div>
  );
}
