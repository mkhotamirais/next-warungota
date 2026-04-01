"use client";

import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  menu: { label: string; url: string }[];
}

export default function NavMobilePushContent({ open, setOpen, menu }: Props) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`grid transition-all duration-300 ease-in-out md:hidden ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="overflow-hidden border-b">
        <div className="p-2">
          {menu.map((item, i) => (
            <Button key={i} asChild variant={"ghost"} className="block mb-2">
              <Link href={item.url} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
