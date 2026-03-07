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
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "../Logo";
import Link from "next/link";

interface Props {
  menu: { label: string; url: string }[];
  authBtn: React.ReactNode;
}
export default function NavMobile({ menu, authBtn }: Props) {
  return (
    <div className="md:hidden flex items-center justify-end gap-2">
      <div>{authBtn}</div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size={"icon-lg"} aria-label="mobile menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-64">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription className="sr-only">Mobile Menu</SheetDescription>
          </SheetHeader>
          <div>
            <nav>
              {menu.map((item, i) => (
                <SheetClose key={i} asChild>
                  <Button variant={"ghost"} asChild className="block">
                    <Link href={item.url}>{item.label}</Link>
                  </Button>
                </SheetClose>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
