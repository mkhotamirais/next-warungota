"use client";

import React from "react";
import c from "@/lib/content.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavDesktop() {
  return (
    <nav className="hidden sm:flex">
      {c.main_menu.map((item, i) => (
        <Link href={item.url} key={i}>
          <Button variant={"ghost"}>{item.label}</Button>
        </Link>
      ))}
    </nav>
  );
}
