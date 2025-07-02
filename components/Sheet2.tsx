"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

interface ISheet2 {
  title: React.ReactNode;
  children?: React.ReactNode;
  menu?: { label: string; url: string }[];
  triggerIcon?: React.ReactNode;
}

export default function Sheet2({ title, children, menu = [], triggerIcon = <Menu /> }: ISheet2) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"} aria-label="mobile-menu-trigger">
          {triggerIcon}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="px-3 flex flex-col gap-1">
          {menu.map((item, i) => (
            <SheetClose key={i} asChild>
              <Link href={item.url}>
                <Button variant={"outline"} className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            </SheetClose>
          ))}
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
