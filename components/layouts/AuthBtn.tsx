"use client";

import Link from "next/link";
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
import Image from "next/image";
import { menu as m } from "@/lib/constants";

export default function AuthBtn() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  const menu = user?.role === "ADMIN" ? m.admin : m.user;

  if (status === "loading") return null;

  return (
    <div>
      {session && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              aria-label="user initial"
              size={"icon-lg"}
              className="rounded-full overflow-hidden"
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  width={50}
                  height={50}
                  alt="user image"
                  className="w-full h-full object-center object-cover"
                />
              ) : (
                initial
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              {menu.map((item, i) => (
                <DropdownMenuItem key={i}>
                  <Link href={item.url}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ redirectTo: "/login" })}>Logout</DropdownMenuItem>
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
