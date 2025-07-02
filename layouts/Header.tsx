import Logo from "@/components/Logo";
import React from "react";
import NavMobile from "./NavMobile";
import NavDesktop from "./NavDesktop";

export default function Header() {
  return (
    <header className="h-16 sticky top-0 z-50 bg-background">
      <div className="container flex items-center justify-between">
        <Logo />
        <div className="flex items-center">
          <NavDesktop />
          <NavMobile />
        </div>
      </div>
    </header>
  );
}
