"use client";

import React from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@/hooks/zustand/useMobileMenu";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function NavMobilePushBtn({ open, setOpen }: Props) {
  return (
    <Button onClick={() => setOpen(!open)} variant={"ghost"} size={"icon"} className="md:hidden">
      {open ? <X /> : <Menu />}
    </Button>
  );
}
