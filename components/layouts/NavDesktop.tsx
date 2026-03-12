import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  menu: { label: string; url: string }[];
}

export default function NavDesktop({ menu }: Props) {
  return (
    <div className="hidden md:flex items-center gap-1 justify-between">
      <nav>
        {menu.map((item, i) => (
          <Button key={i} variant={"ghost"} asChild>
            <Link href={item.url}>{item.label}</Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
