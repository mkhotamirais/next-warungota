"use client";

import React from "react";
import { menu as m } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function AsideMenuDesktop() {
  const { data: session } = useSession();
  const user = session?.user;

  const menu = user?.role === "ADMIN" ? m.admin : m.user;

  return (
    <div className="mr-6">
      {menu.map((item, i) => (
        <Button variant={"ghost"} asChild key={i} className="block mt-1">
          <Link href={item.url} className="">
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
