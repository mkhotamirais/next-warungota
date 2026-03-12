"use client";

import React from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@/hooks/zustand/useMobileMenu";

export default function NavMobilePushBtn() {
  const { open, setOpen } = useMobileMenu();

  return (
    <Button onClick={() => setOpen(!open)} variant={"ghost"} size={"icon"} className="md:hidden">
      {open ? <X /> : <Menu />}
    </Button>
  );
}
