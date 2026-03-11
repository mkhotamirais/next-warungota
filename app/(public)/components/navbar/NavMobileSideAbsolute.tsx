import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import { menu } from "./menu";
import Link from "next/link";

export default function NavMobileSideAbsolute() {
  const [open, setOpen] = useState(false);

  return (
    <div className="block md:hidden">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            aria-label="mobile menu"
            size={"icon"}
            variant={"outline"}
            onClick={() => setOpen((prev) => !prev)}
          >
            <Menu />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Nav Mobie Side Absolute</p>
        </TooltipContent>
      </Tooltip>

      <div
        onClick={() => setOpen(false)}
        className={`${open ? "visible opacity-100" : "invisible opacity-0"} transition-all fixed inset-0 bg-black/10 z-50`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${open ? "translate-x-0" : "translate-x-full"} transition-all absolute right-0 h-full w-64 bg-white border-l`}
        >
          <nav className="p-3">
            <div>Logo</div>
            <div>
              {menu.map((item, i) => (
                <Button key={i} variant={"ghost"} asChild className="block">
                  <Link href={item.url}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
