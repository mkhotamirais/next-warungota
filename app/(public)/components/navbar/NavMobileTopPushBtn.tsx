import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu, X } from "lucide-react";
import React from "react";
import { useNavMobileTopPush } from "./useNavMobileTopPush";

export default function NavMobileTopPushBtn() {
  const { open, setOpen } = useNavMobileTopPush();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" aria-label="mobile menu" size={"icon"} variant={"outline"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Nav Mobile Top Push</p>
      </TooltipContent>
    </Tooltip>
  );
}
